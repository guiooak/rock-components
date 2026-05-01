import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StudProvider, useStudTheme } from './StudProvider';

const mockMatchMedia = (matches: boolean) => {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    },
    dispatchEvent: () => true,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
  return {
    mql,
    fire: (next: boolean) => {
      mql.matches = next;
      listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent));
    },
  };
};

describe('StudProvider', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('renders children', () => {
    render(
      <StudProvider>
        <span>hello</span>
      </StudProvider>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('applies data-theme="light" by default when system prefers light', () => {
    render(
      <StudProvider>
        <span data-testid="child">x</span>
      </StudProvider>,
    );
    const wrapper = screen.getByTestId('child').parentElement;
    expect(wrapper).toHaveAttribute('data-theme', 'light');
  });

  it('applies data-theme="dark" when system prefers dark', () => {
    mockMatchMedia(true);
    render(
      <StudProvider>
        <span data-testid="child">x</span>
      </StudProvider>,
    );
    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark',
    );
  });

  it('respects explicit theme prop', () => {
    render(
      <StudProvider theme="dark">
        <span data-testid="child">x</span>
      </StudProvider>,
    );
    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark',
    );
  });

  it('reacts to system theme changes when theme="system"', () => {
    const mock = mockMatchMedia(false);
    render(
      <StudProvider theme="system">
        <span data-testid="child">x</span>
      </StudProvider>,
    );
    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'light',
    );
    act(() => mock.fire(true));
    expect(screen.getByTestId('child').parentElement).toHaveAttribute(
      'data-theme',
      'dark',
    );
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <StudProvider>
        <button type="button">Click me</button>
      </StudProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('useStudTheme', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('exposes theme, resolvedTheme, and setTheme', () => {
    const { result } = renderHook(() => useStudTheme(), {
      wrapper: ({ children }) => (
        <StudProvider theme="light">{children}</StudProvider>
      ),
    });
    expect(result.current.theme).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('switches theme via setTheme', () => {
    const { result } = renderHook(() => useStudTheme(), {
      wrapper: ({ children }) => (
        <StudProvider theme="light">{children}</StudProvider>
      ),
    });
    act(() => result.current.setTheme('dark'));
    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('throws when used outside StudProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    expect(() => renderHook(() => useStudTheme())).toThrow(
      /must be used inside a <StudProvider>/,
    );
    spy.mockRestore();
  });
});
