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
            resetTimeout: null,
            optionsTimeout: null,
            hasBeenReset: false,
            surfingColors: true,
            optionsOpen: false,
            theColors: [
                {red: 44,  green: 44,  blue: 88,  name: "indigo"},
                {red: 0,   green: 0,   blue: 0,   name: "black" },
                {red: 158, green: 20,  blue: 20,  name: "red"   },
                {red: 239, green: 90,  blue: 173, name: "pink"  },
                {red: 25,  green: 60,  blue: 9,   name: "green" },
                {red: 49,  green: 115, blue: 198, name: "blue"  }
            ],
            currentColor: 0,
            pseudoRandom: true,
            pseudoRandomCount: 2,
            clickMode: "click"
        }

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.closeOptions = this.closeOptions.bind(this);
        this.deleteColor = this.deleteColor.bind(this);
        this.pseudoRandomCheckChange = this.pseudoRandomCheckChange.bind(this);
        this.pseudoRandomCountChange = this.pseudoRandomCountChange.bind(this);
        this.touchStart = this.touchStart.bind(this);
    }

    componentDidMount() {
        this.surfColors()
    }

    mouseDown() {
        if (this.state.clickMode==="click") {
            this.touchStart()
            console.log("mouse down")
        }
    }

    mouseUp() {
        if (this.state.clickMode==="click") {
            this.touchEnd()
            console.log("mouse up")
        }
    }

    touchStart() {
        this.setState( {clickMode: "touch"} )
        console.log("touch start")
        if (!this.state.surfingColors && !this.state.optionsOpen) {
            this.resetTimeout()
        } else if (this.state.surfingColors && !this.state.optionsOpen) {
            this.optionsTimeout()
        }
    }

    touchEnd() {
        console.log("touch end")
        this.setState({hasBeenReset: false})
        clearTimeout(this.state.resetTimeout)
        clearTimeout(this.state.optionsTimeout)
        if (!this.state.hasBeenReset && !this.state.optionsOpen) {
            clearInterval(this.state.colorSurfInterval)
            this.setState({surfingColors: false})
            this.changeColor()
        }
    }

    changeColor() { //needs a way to confirm click registered, particularly when PR is disabled (count? text flash?)
        let thePreviousColors = this.state.previousColors
        let theColors = this.state.theColors
        let pseudoRandom = this.state.pseudoRandom
        let pseudoRandomCount = this.state.pseudoRandomCount

        let availableColors = [] //specifying which colors are viable to choose
        if (pseudoRandom) {
            for (let i = 0; i < theColors.length; i++) {
                if (!thePreviousColors.includes(i)) {
                    availableColors.push(i)
                }
            }
        } else {
            availableColors = theColors //all colors are ok if PR is off
        }

        let chosenColorIndex = availableColors[randomInteger(0, availableColors.length - 1)] //choosing a new color to change to

        if (pseudoRandom) { //we don't need to keep track of the prev colors if PR is off
            thePreviousColors.push(chosenColorIndex) //updating previous colors array in state
            if (thePreviousColors.length<=pseudoRandomCount) {
                this.setState({
                    previousColors: thePreviousColors
                })
            } else {
                this.setState({
                    previousColors: thePreviousColors.slice(1,thePreviousColors.length)
                })
            }
        }

        this.setState({ //changing the color
            red: theColors[chosenColorIndex].red,
            green: theColors[chosenColorIndex].green,
            blue: theColors[chosenColorIndex].blue
        })
        console.log("color changed")
    }

    surfColors(colorInputObject) {                    //setting up a color shifting wait screen; starts from color that is input, if there is one
        this.setState({surfingColors: true})
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
        }, 16.67) //60hz
        this.setState({colorSurfInterval: colorSurfInterval})
    }

    resetTimeout() {
        let resetTimeout = setTimeout(() => {
            this.setState({previousColors: [], hasBeenReset: true}) //reset
            this.surfColors({
                red: this.state.red,
                green: this.state.green,
                blue: this.state.blue
            })
        }, 1000)                                    //hold for 1 sec to reset
        this.setState({resetTimeout: resetTimeout})
    }

    optionsTimeout() {
        let optionsTimeout = setTimeout(() => {
            clearInterval(this.state.colorSurfInterval)
            this.setState({optionsOpen: true, surfingColors: false}) //open em up
            this.openOptions()
        }, 1000)                                    //hold for 1 sec to open
        this.setState({optionsTimeout: optionsTimeout})
    }

    openOptions() {
        let initRed = this.state.red
        let initGreen = this.state.green
        let initBlue = this.state.blue

        let redRate = Math.floor(initRed/30) + 1
        let greenRate = Math.floor(initGreen/30) + 1
        let blueRate = Math.floor(initBlue/30) + 1

        let openOptionsInterval = setInterval(()=>{
            if (this.state.red > 0 || this.state.green > 0 || this.state.blue > 0) { //this can result in negative values..reconsider?
                this.setState({
                    red: this.state.red - redRate,
                    green: this.state.green - greenRate,
                    blue: this.state.blue - blueRate
                })
            } else {
                clearInterval(openOptionsInterval)
                this.setState({
                    red: 0,
                    green: 0, 
                    blue: 0
                })
            }
        }, 16.67)
    }

    optionsMenu(optionsOpen, theColors) {
        let pseudoRandom = this.state.pseudoRandom
        if (!optionsOpen) {
            return null
        } else {
            let colorArray = []
            let i = 0
            for (let color of theColors) {
                let redX;
                if (theColors.length===1) {
                    redX = [
                        <svg id={"red-x-" + i} className="red-x" viewBox="0 0 10 10" key="0"></svg> //empty transparent box where x would go--we can't delete our last color!
                    ]
                } else {
                    redX = [
                        <svg id={"red-x-" + i} className="red-x" viewBox="0 0 10 10" onClick={this.deleteColor} key="0">    {/* this is the x to remove a color*/}
                            <polygon id={i} points="1,2 2,1 9,8 8,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}}/>
                            <polygon id={i} points="9,2 8,1 1,8 2,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}} />
                        </svg>
                    ]
                }
                colorArray.push(
                    <div key={i} className="color-item">
                        <div className="color-item-inner">
                            <label style={{color: "white"}}><strong>color {i+1}</strong></label>
                            <svg className="color-box" viewBox="0 0 10 5">                    {/*a little box to show what the color is*/}
                                <polygon points="0,0 10,0 10,5 0,5" style={{fill: `rgb(${color.red},${color.green},${color.blue})`, stroke: "white", strokeWidth: "1"}}/>
                            </svg>
                            <label style={{
                                color: `rgb(${color.red},${color.green},${color.blue})`,
                                textShadow: "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white"
                            }}>
                                <strong>{color.name}</strong>
                            </label>
                        </div>
                        <div className="color-item-inner">
                            <svg className="edit-button" viewBox="0 0 10 10" onClick={()=>{}}>            {/* this is the pencil icon for editing a color*/}
                                <polygon points="1,9 2,7 8,1 9,2 3,8" style={{fill: "green", stroke: "green", strokeWidth: "1"}}/>
                            </svg>
                            {redX}
                        </div>
                    </div>
                )
                i++;
            }

            let pseudoRandomCountSection; //we want to hide this section if PR is disabled
            if (pseudoRandom) {
                pseudoRandomCountSection = [
                    <label className="indented" key="0"># of excluded colors: 
                        <input 
                            type="number" className="num-input" name="pseudo-random-count" //needs a check for posint in range
                            min="1" max={this.state.theColors.length - 1}
                            onChange={this.pseudoRandomCountChange} defaultValue="2"
                        />
                    </label>
                ]
            } else {
                pseudoRandomCountSection = null;
            }

            return ( 
                <div id="options-menu">
                    <div id="the-x-div">
                        <svg id="the-x" viewBox="0 0 10 10" onClick={this.closeOptions}>                    {/* this is the x to get out of the options*/}
                            <polygon points="1,2 2,1 9,8 8,9" style={{fill: "white", stroke: "white", strokeWidth: "1"}}/>
                            <polygon points="9,2 8,1 1,8 2,9" style={{fill: "white", stroke: "white", strokeWidth: "1"}} />
                        </svg>
                    </div>
                    <h1>Options</h1>
                    <h2>Colors</h2>
                    {colorArray}
                    <div className="options-section">
                        <label>
                            <input type="checkbox" name="pseudo-random-check" onChange={this.pseudoRandomCheckChange} defaultChecked/>pseudo randomness
                        </label>
                        {pseudoRandomCountSection}
                    </div>
                </div>
            )
        }
    }

    closeOptions() {
        this.setState( {optionsOpen: false} )
        let black = {
            red: 0,
            green: 0,
            blue: 0
        }
        this.surfColors(black)
    }
    
    deleteColor(event) {
        let colorNumber = Number(event.target.id.slice(-1))
        let theColors = this.state.theColors
        theColors.splice(colorNumber, 1)
        this.setState( {theColors: theColors} )
        //should check to see if you deleted too many colors & accordingly change PRC; plus if length is 1 PR change to false
    }

    pseudoRandomCheckChange(event) {
        if (event.target.checked) {
            this.setState( {pseudoRandom: true} )
        } else {
            this.setState( {pseudoRandom: false} )
        }
    }

    pseudoRandomCountChange(event) {
        this.setState( {pseudoRandomCount: Number(event.target.value)} )
    }

    render() {
        return (
            <div
                id="the-div"
                style={{backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`}}
                onMouseDown={this.mouseDown}
                onMouseUp={this.mouseUp}
                onTouchStart={this.touchStart}
                onTouchEnd={this.touchEnd}
                onTouchCancel={this.touchCancel}
            >
                {this.optionsMenu(this.state.optionsOpen, this.state.theColors)}
            </div>
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

//  Xoptions menu
//      *help
//      *custom color rotation
//      *random color
//          *random color within range
//      *show color name
//      *show color value
//      *pseudo random toggle
//          *pseudo random # of previous choices excluded
//      *text display
//  Xreset function
//  *cookies to save settings