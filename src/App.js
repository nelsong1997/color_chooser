import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            property: "value"
        }
        //this.NChange = this.NChange.bind(this);
    }

    render() {
        return <div id="the-div"></div>
    }
}

export default App;
