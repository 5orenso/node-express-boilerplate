import { h, Component } from 'preact';
import './style.scss';

export default class App extends Component {
    render(props) {
        const that = this;
        return (
            <div>
                <h1 style={{ color: props.color }}>Hello, World! {that.name}</h1>
            </div>
        );
    }
}
