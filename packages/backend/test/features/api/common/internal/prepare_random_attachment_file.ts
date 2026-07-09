import { IAttachmentFile } from "@samchon/shopping-api";
import { RandomGenerator } from "@nestia/e2e";

export const prepare_random_attachment_file = (
  input?: Partial<IAttachmentFile.ICreate>,
): IAttachmentFile.ICreate => ({
  name: RandomGenerator.alphabets(8),
  extension: RandomGenerator.alphabets(3),
  url: "https://picsum.photos/800/600?random",
  ...input,
});
