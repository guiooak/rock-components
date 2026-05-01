import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import { render, screen } from '../../utils/test-utils';
import { Template } from './Template';

describe('Template', () => {
  it('renders children', () => {
    render(<Template>hello</Template>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('exposes the public sd-template class on the root', () => {
    render(<Template data-testid="t">x</Template>);
    expect(screen.getByTestId('t')).toHaveClass('sd-template');
  });

  it('forwards refs to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Template ref={ref}>x</Template>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges consumer className with the public block class', () => {
    render(
      <Template data-testid="t" className="custom">
        x
      </Template>,
    );
    const el = screen.getByTestId('t');
    expect(el).toHaveClass('sd-template');
    expect(el).toHaveClass('custom');
  });

  it('marks aria-disabled when disabled', () => {
    render(
      <Template data-testid="t" disabled>
        x
      </Template>,
    );
    expect(screen.getByTestId('t')).toHaveAttribute('aria-disabled', 'true');
  });

  it('forwards arbitrary HTML props', () => {
    render(
      <Template data-testid="t" id="hello" title="world">
        x
      </Template>,
    );
    const el = screen.getByTestId('t');
    expect(el).toHaveAttribute('id', 'hello');
    expect(el).toHaveAttribute('title', 'world');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Template>accessible</Template>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
