import { NestiaEditorModule } from "@nestia/editor/lib/NestiaEditorModule";
import { NestiaSwaggerComposer } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { ShoppingConfiguration } from "./ShoppingConfiguration";
import { ShoppingGlobal } from "./ShoppingGlobal";
import { ShoppingModule } from "./ShoppingModule";
import { ShoppingSetupWizard } from "./setup/ShoppingSetupWizard";

export class ShoppingBackend {
  private application_?: NestFastifyApplication;

  public async open(): Promise<void> {
    // AUTO-SEED IF EMPTY
    const count: number = await ShoppingGlobal.prisma.shopping_channels.count();
    if (count === 0) {
      console.log("Empty database detected, seeding demo data...");
      await ShoppingSetupWizard.seed();
      console.log("Seeding complete.");
    }

    // MOUNT CONTROLLERS
    this.application_ = await NestFactory.create(
      ShoppingModule,
      new FastifyAdapter(),
    );

    // THE SWAGGER EDITOR
    const document = await NestiaSwaggerComposer.document(this.application_, {
      openapi: "3.1",
      servers: [
        {
          url: "https://shopping-be.wrtn.ai",
          description: "Production, the real server",
        },
        {
          url: "http://localhost:37001",
          description: "Local Server",
        },
      ],
    });
    await NestiaEditorModule.setup({
      path: "editor",
      application: this.application_,
      swagger: document as any,
      package: "Shopping Backend",
      simulate: true,
      e2e: true,
    });

    // DO OPEN
    this.application_.enableCors();
    await this.application_.listen(ShoppingConfiguration.API_PORT(), "0.0.0.0");

    console.log("Backend Started");
  }

  public async close(): Promise<void> {
    if (this.application_ === undefined) return;

    // DO CLOSE
    await this.application_.close();
    delete this.application_;
  }
}
