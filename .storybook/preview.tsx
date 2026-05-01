import type { Preview } from '@storybook/react-vite';
import { StudProvider, type StudTheme } from '../src/provider';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Docs',
          ['Introduction', 'Engineering Guidelines', '*'],
          'Components',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Active theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals['theme'] ?? 'light') as StudTheme;
      return (
        <StudProvider theme={theme}>
          <Story />
        </StudProvider>
      );
    },
  ],
};

export default preview;
