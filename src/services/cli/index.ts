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
