import { h, Component } from 'preact';
import styles from './style.css';

export default class App extends Component {
    render(props) {
        const that = this;
        return (
            <div>
                <h1 style={`color: ${props.color} ${styles.h1}`}>Hello, World! {that.name}</h1>
            </div>
        );
    }
}
