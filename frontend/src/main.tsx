import { StrictMode, type DetailedHTMLProps, type HTMLAttributes } from 'react'
// import './test.css';
import './index.css';

import ReactDOM from 'react-dom/client';
import App from './App';
import { defineCustomElements, type JSX as LocalJSX } from 'blip-ds/loader';
type StencilToReactElements<T = LocalJSX.IntrinsicElements> = {
  [P in keyof T]?: T[P] &
    Omit<DetailedHTMLProps<HTMLAttributes<T[P]>, T[P]>, 'className'> & {
      class?: string;
    };
};
type StencilToReactRef<T = HTMLElementTagNameMap> = {
  [P in keyof T]: {
    ref?: DetailedHTMLProps<HTMLAttributes<T[P]>, T[P]>['ref'];
  };
};
type StencilToReact<T = LocalJSX.IntrinsicElements, U = HTMLElementTagNameMap> = StencilToReactElements<T> &
  StencilToReactRef<U>;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends StencilToReact {}
  }
}
defineCustomElements(window);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);