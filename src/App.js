import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            red: 94,
            green: 36,
            blue: 102,
            previousColors: []
        }
        this.changeColor = this.changeColor.bind(this);
    }

    changeColor() {
        let thePreviousColors = this.state.previousColors
        function randomInteger(min, max) {
            let range = max - min + 1
            return Math.floor(range*(Math.random())) + min
        }
        let theColors = [
            {red: 44, green: 44, blue: 88},     //default
            {red: 0, green: 0, blue: 0},     //black
            {red: 73, green: 9, blue: 9},       //red
            {red: 239, green: 90, blue: 173},    //pink
            {red: 25, green: 60, blue: 9},      //green
            {red: 49, green: 115, blue: 198}      //blue
        ]

        let availableColors = []
        for (let i = 0; i < 6; i++) {
            if (!thePreviousColors.includes(i)) {
                availableColors.push(i)
            }
        }

        let chosenColorIndex = availableColors[randomInteger(0, availableColors.length - 1)]

        thePreviousColors.push(chosenColorIndex)
        if (thePreviousColors.length<3) {
            this.setState({
                previousColors: thePreviousColors
            })
        } else {
            this.setState({
                previousColors: thePreviousColors.slice(1,thePreviousColors.length)
            })
        }

        this.setState({
            red: theColors[chosenColorIndex].red,
            green: theColors[chosenColorIndex].green,
            blue: theColors[chosenColorIndex].blue
        })
    }

    render() {
        return (
            <div
                id="the-div"
                style={{backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`}}
                onClick={this.changeColor}
            />
        )
    }
}

export default App;
