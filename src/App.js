import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            red: 94,
            green: 36,
            blue: 102,
            previousColors: [],
            colorSurfInterval: null,
            theTimeout: null,
            hasBeenReset: false
        }
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    componentDidMount() {
        this.surfColors()
    }

    mouseDown() {
        let theTimeout = setTimeout(() => {
            this.setState({previousColors: [], hasBeenReset: true}) //reset
            this.surfColors({
                red: this.state.red,
                green: this.state.green,
                blue: this.state.blue
            })
        }, 2000)                                    //hold for 2 secs to reset
        this.setState({theTimeout: theTimeout})
    }

    mouseUp() {
        this.setState({hasBeenReset: false})
        clearTimeout(this.state.theTimeout)
        if (!this.state.hasBeenReset) {
            clearInterval(this.state.colorSurfInterval)
            this.changeColor()
        }
    }

    changeColor() {
        let thePreviousColors = this.state.previousColors
        let theColors = [
            {red: 44,  green: 44,  blue: 88 },     //default/indigo
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

    surfColors(colorInputObject) {                          //setting up a color shifting wait screen
        let redT = randomInteger(0, 100)   //initial values for the variable; sin of this variable will be the color value
        let greenT = randomInteger(0, 100)
        let blueT = randomInteger(0, 100)
        if (colorInputObject) {                                //if from a reset; starting with the color we reset from
            redT = Math.asin((colorInputObject.red - 128)/128)
            greenT = Math.asin((colorInputObject.green - 128)/128)
            blueT = Math.asin((colorInputObject.blue - 128)/128)
        }
        let redRate = randomInteger(0, 100)/10000 + 0.005 //how fast this color value changes
        let greenRate = randomInteger(0, 100)/10000 + 0.005
        let blueRate = randomInteger(0, 100)/10000 + 0.005

        let colorSurfInterval = setInterval(()=>{
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
        this.setState({colorSurfInterval: colorSurfInterval})
    }

    render() {
        return (
            <div
                id="the-div"
                style={{backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`}}
                onMouseUp={this.mouseUp}
                onMouseDown={this.mouseDown}
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