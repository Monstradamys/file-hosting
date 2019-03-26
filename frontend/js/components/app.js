import React from 'react';
import FoldersContainer from './folderscontainer.js'
import MainForm from './mainform';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <h1>Hosting</h1>
                <MainForm />
                <FoldersContainer />
            </React.Fragment>
        )
    }
}