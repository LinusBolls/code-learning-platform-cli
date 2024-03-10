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
};

export function quitApplication() {
  process.stdout.write(
    AnsiCode.clearScreen + AnsiCode.moveCursorToTopLeft + AnsiCode.showCursor
  );
  process.exit(0);
}
