import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            red: 94,
            green: 36,
            blue: 102,
            previousColors: [],
            theInterval: null
        }
        this.changeColor = this.changeColor.bind(this);
    }

    componentDidMount() {               //setting up a color shifting wait screen
        let redT = randomInteger(0, 100)   //initial values for the variable; sin of this variable will be the color value
        let greenT = randomInteger(0, 100)
        let blueT = randomInteger(0, 100)
        let redRate = randomInteger(0, 100)/10000 + 0.005 //how fast this color value changes
        let greenRate = randomInteger(0, 100)/10000 + 0.005
        let blueRate = randomInteger(0, 100)/10000 + 0.005

        let theInterval = setInterval(()=>{
            redT = redT + redRate
            greenT = greenT + greenRate
            blueT = blueT + blueRate
            this.setState(
                {
                    red:   Math.floor((Math.sin(redT))*128 + 128), //sin is used to avoid rapid shift from 255 to 0
                    green: Math.floor((Math.sin(greenT))*128 + 128),
                    blue:  Math.floor((Math.sin(blueT))*128 + 128)
                }
            )
        }, 17)
        this.setState({theInterval: theInterval})
    }

    changeColor() {
        clearInterval(this.state.theInterval)
        let thePreviousColors = this.state.previousColors
        let theColors = [
            {red: 44,  green: 44,  blue: 88 },     //default
            {red: 0,   green: 0,   blue: 0  },     //black
            {red: 73,  green: 9,   blue: 9  },     //red
            {red: 239, green: 90,  blue: 173},     //pink
            {red: 25,  green: 60,  blue: 9  },     //green
            {red: 49,  green: 115, blue: 198}      //blue
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

    startClickTimer() {
        
    }

    render() {
        return (
            <div
                id="the-div"
                style={{backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`}}
                onMouseUp={this.changeColor}
                onMouseDown={this.startClickTimer}
            />
        )
    }
}

//----helper functions----//

function randomInteger(min, max) {
    let range = max - min + 1
    return Math.floor(range*(Math.random())) + min
}

export default App;

//----------planned features-------------//

//  options menu
//      *help
//      *custom color rotation
//      *random color
//          *random color within range
//      *show color name
//      *show color value
//      *pseudo random toggle
//          *pseudo random # of previous choices excluded
//  reset function
//  cookies to save settings