export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 Shopping Mall. All rights reserved.</p>
        <p className="mt-2">
          Built with{" "}
          <a
            href="https://nestia.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Nestia
          </a>{" "}
          SDK
        </p>
      </div>
    </footer>
  );
};
