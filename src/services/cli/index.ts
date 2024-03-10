import meow from 'meow';

export const cli = meow(
  `
	Usage
	  $ my-ink-cli

	Options
		--program  A study program (e.g. "SE", "PM", "ID")

	Examples
	  $ my-ink-cli --name=Jane
	  Hello, Jane
`,
  {
    importMeta: import.meta,
    flags: {
      moduleId: {
        type: 'string',
      },
    },
  }
);

export const AnsiCode = {
  clearScreen: '\x1b[2J',
  moveCursorToTopLeft: '\x1b[0;0H',
  showCursor: '\x1b[?25h',
  hideCursor: '\x1b[?25l',
};

export function clearTerminalOnStartup() {
  process.stdout.write(
    AnsiCode.clearScreen + AnsiCode.moveCursorToTopLeft + AnsiCode.hideCursor
  );
}

export function quitApplication() {
  process.stdout.write(
    AnsiCode.clearScreen + AnsiCode.moveCursorToTopLeft + AnsiCode.showCursor
  );
  process.exit(0);
}

export const ExecutionContext = {
  runtime: {
    // @ts-expect-error
    isNode: typeof Bun === 'undefined',
    /**
     * Bun is a javascript runtime (meadning a modern alternative to NodeJs), that has first-class typescript support, among other advantages.
     * however, some NodeJs apis are not yet supported by Bun, so we have to accommodate this:
     * (1) `console.Console` constructor, which is used by `ink` to patch the console.
     * (2) `ink`s `useInput` hook
     */
    // @ts-expect-error
    isBun: typeof Bun !== 'undefined',
  },
  terminal: {
    width: process.stdout.columns,
    height: process.stdout.rows,
  },
} as const;
