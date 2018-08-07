/* eslint-env node, jest */

import { h } from "preact";
import HelloWorld from './../../../../src/components/hello-world/index';
import render from "preact-render-to-string";

describe("src/components/HelloWorld", () => {
    it('should render HelloWorld', () => {
        const input = render(<HelloWorld that={this} />);
        expect(input).toBe('<div><h1>Hello, World! </h1></div>');
    })
});
