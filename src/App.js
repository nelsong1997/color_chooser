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
            hasBeenReset: false, //change to transitioning?
            surfingColors: true, // change this and below to a single prop in state with string value?
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
            clickMode: "click",
            editingColorNum: null,
            editingColor: null,
            addingColor: false
        }

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.beginClick = this.beginClick.bind(this);
        this.endClick = this.endClick.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.closeOptions = this.closeOptions.bind(this);
        this.deleteColor = this.deleteColor.bind(this);
        this.pseudoRandomCheckChange = this.pseudoRandomCheckChange.bind(this);
        this.pseudoRandomCountChange = this.pseudoRandomCountChange.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.editColor = this.editColor.bind(this);
        this.closeEditMenu = this.closeEditMenu.bind(this);
        this.saveColorEdits = this.saveColorEdits.bind(this);
        this.colorInputChange = this.colorInputChange.bind(this);
        this.openAddColor = this.openAddColor.bind(this);

        this.pseudoRandomCountInput = React.createRef();
        this.pseudoRandomCheckbox = React.createRef();
        this.nameInput = React.createRef();
        this.redInput = React.createRef();
        this.greenInput = React.createRef();
        this.blueInput = React.createRef();
    }

    componentDidMount() {
        this.surfColors()
    }

    mouseDown() {
        if (this.state.clickMode==="click") {
            this.beginClick()
        }
    }

    mouseUp() {
        if (this.state.clickMode==="click") {
            this.endClick()
        }
    }

    touchStart() {
        this.setState( {clickMode: "touch"} )
        this.beginClick()
    }
    
    touchEnd() {
        this.endClick()
    }

    beginClick() {
        if (!this.state.surfingColors && !this.state.optionsOpen) {
            this.resetTimeout()
        } else if (this.state.surfingColors && !this.state.optionsOpen) {
            this.optionsTimeout()
        }
    }

    endClick() {
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
            for (let i = 0; i < theColors.length; i++) { //all colors are ok if PR is off
                availableColors.push(i)
            }
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
        console.log("color changed to " + theColors[chosenColorIndex].name)
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
        let editingColorNum = this.state.editingColorNum
        let addingColor = this.state.addingColor
        if (!optionsOpen) {
            return null
        } else {
            let colorArray = []
            let i = 0
            for (let color of theColors) {
                let editButton = null;
                if (typeof(editingColorNum)!=="number" && !addingColor) { //nothing being edited
                    editButton = [
                        <button id={"edit-button-" + i} className="square-button" key={i}>
                            <svg className="edit-svg" id={i} viewBox="0 0 10 10" onClick={this.editColor}>        {/* this is the pencil icon for editing a color*/}
                                <polygon id={i} points="1,9 2,7 8,1 9,2 3,8" style={{fill: "green", stroke: "green", strokeWidth: "1"}}/>
                            </svg>
                        </button>
                    ]
                }
                if (typeof(editingColorNum)!=="number" || i!==editingColorNum) { //something else is being edited or nothing is being edited
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
                                {editButton}
                            </div>
                        </div>
                    )
                } else if (i===editingColorNum) { //this color is being edited
                    colorArray.push(
                        <div key={i}>
                            <div className="color-item">
                                <div className="color-item-inner">
                                    <button id={"trash-" + i} className="square-button">
                                        <svg id={i} className="trash" viewBox="0 0 10 10" onClick={this.deleteColor}>
                                            <polygon id={i} points="2,9 8,9 8,3 9,3 9,2 8,2 8,1 2,1 2,2 1,2 1,3 2,3" style={{fill: "gray", stroke: "gray", strokeWidth: "1"}}/>
                                        </svg>
                                    </button>
                                    <label>name: </label>
                                    <input type="text" id="name-input" defaultValue={color.name} ref={this.nameInput}/>
                                </div>
                                <div className="color-item-inner">
                                    <button className="square-button">
                                        <svg className="red-x" viewBox="0 0 10 10" onClick={this.closeEditMenu}>    {/* this is the x to close edit menu*/}
                                            <polygon id={i} points="1,2 2,1 9,8 8,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}}/>
                                            <polygon id={i} points="9,2 8,1 1,8 2,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}}/>
                                        </svg>
                                    </button>
                                    <button id={"save-edits-" + i} className="square-button">
                                        <svg className="save-edits" id={i} viewBox="0 0 10 8" onClick={this.saveColorEdits}>
                                            <polygon id={i} points="1,4 2,3 4,5 8,1 9,2 4,7" style={{fill: "green", stroke: "green", strokeWidth: "1"}}/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="color-item more-indented">
                                <div className="color-item-inner">
                                    <label>r:</label>
                                    <input
                                        id={"red-input-" + i} type="number" min="0" max="255" className="num-input"
                                        defaultValue={color.red} ref={this.redInput} onChange={this.colorInputChange}
                                    />
                                    <label>g:</label>
                                    <input
                                        id={"green-input-" + i} type="number" min="0" max="255" className="num-input"
                                        defaultValue={color.green} ref={this.greenInput} onChange={this.colorInputChange}
                                    />
                                    <label>b:</label>
                                    <input
                                        id={"blue-input-" + i} type="number" min="0" max="255" className="num-input"
                                        defaultValue={color.blue} ref={this.blueInput} onChange={this.colorInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
                i++;
            }

            let pseudoRandomSection;
            if (pseudoRandom) {
                pseudoRandomSection = [
                    <div className="options-section" key="0">
                        <h2>Other</h2>
                        <label>
                            <input
                                type="checkbox" name="pseudo-random-check" ref={this.pseudoRandomCheckbox}
                                onChange={this.pseudoRandomCheckChange} defaultChecked
                            />pseudo randomness
                        </label>
                        <label className="indented"># of excluded colors: 
                            <input 
                                type="number" className="num-input" name="pseudo-random-count" //needs a check for posint in range
                                min="1" max={this.state.theColors.length - 1}
                                onChange={this.pseudoRandomCountChange} defaultValue={this.state.pseudoRandomCount}
                                ref={this.pseudoRandomCountInput}
                            />
                        </label>
                    </div>
                ]
            } else {
                pseudoRandomSection = [
                    <div className="options-section">
                        <h2>Other</h2>
                        <label>
                            <input
                                type="checkbox" name="pseudo-random-check" ref={this.pseudoRandomCheckbox}
                                onChange={this.pseudoRandomCheckChange}
                            />pseudo randomness
                        </label>
                    </div>
                ]
            }
            let addingColorSection;
            if (addingColor) {
                addingColorSection = [
                    <div className="color-item" key="0">
                        <div className="color-item-inner">
                            <label>name: </label>
                            <input type="text" id="name-input" ref={this.nameInput}/>
                        </div>
                        <div className="color-item-inner">
                            <button className="square-button">
                                <svg className="red-x" viewBox="0 0 10 10" onClick={this.closeEditMenu}>    {/* this is the x to close edit menu*/}
                                    <polygon points="1,2 2,1 9,8 8,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}}/>
                                    <polygon points="9,2 8,1 1,8 2,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}}/>
                                </svg>
                            </button>
                            <button id="save-new-color" className="square-button">
                                <svg id="save-new-color" className="save-edits" viewBox="0 0 10 8" onClick={this.saveColorEdits}>
                                    <polygon id="save-new-color" points="1,4 2,3 4,5 8,1 9,2 4,7" style={{fill: "green", stroke: "green", strokeWidth: "1"}}/>
                                </svg>
                            </button>
                        </div>
                    </div>,
                    <div className="color-item more-indented" key="1">
                        <div className="color-item-inner">
                            <label>r:</label>
                            <input
                                id="red-input" type="number" min="0" max="255" className="num-input"
                                ref={this.redInput} onChange={this.colorInputChange}
                            />
                            <label>g:</label>
                            <input
                                id="green-input" type="number" min="0" max="255" className="num-input"
                                ref={this.greenInput} onChange={this.colorInputChange}
                            />
                            <label>b:</label>
                            <input
                                id="blue-input" type="number" min="0" max="255" className="num-input"
                                ref={this.blueInput} onChange={this.colorInputChange}
                            />
                        </div>
                    </div>
                ]
            } else {
                addingColorSection = null;
            }
            return ( 
                <div id="options-menu">
                    <div id="the-x-div">
                        <button id="the-x-button" className="square-button">
                            <svg id="the-x" viewBox="0 0 10 10" onClick={this.closeOptions}>                    {/* this is the x to get out of the options*/}
                                <polygon points="1,2 2,1 9,8 8,9" style={{fill: "white", stroke: "white", strokeWidth: "1"}}/>
                                <polygon points="9,2 8,1 1,8 2,9" style={{fill: "white", stroke: "white", strokeWidth: "1"}} />
                            </svg>
                        </button>
                    </div>
                    <h1>Options</h1>
                    <div className="options-section">
                        <h2>Colors</h2>
                        {colorArray}
                        {addingColorSection}
                        <div id="button-container">
                            <button className="big-button" onClick={this.openAddColor}>add color</button>
                            <button className="big-button">save preset</button>
                        </div>
                    </div>
                    {pseudoRandomSection}
                </div>
            )
        }
    }

    closeOptions() {
        this.setState( {optionsOpen: false, editingColorNum: null} )
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
        let pseudoRandom = this.state.pseudoRandom
        let pseudoRandomCount = this.state.pseudoRandomCount
        theColors.splice(colorNumber, 1)
        this.setState( {theColors: theColors} )
        if (theColors.length <= pseudoRandomCount && pseudoRandom) {
            this.setState( {pseudoRandomCount: theColors.length - 1} )
            this.pseudoRandomCountInput.current.value = theColors.length - 1
        }
        if (theColors.length===1) {
            this.setState( {pseudoRandom: false} )
            this.pseudoRandomCheckbox.current.checked = false
        }
        this.setState({editingColorNum: null})
    }

    pseudoRandomCheckChange(event) {
        if (event.target.checked) {
            this.setState( {pseudoRandom: true} )
        } else {
            this.setState( {pseudoRandom: false} )
        }
    }

    pseudoRandomCountChange(event) {
        let pseudoRandomCount = this.state.pseudoRandomCount
        let theInput = Number(event.target.value)
        let theColors = this.state.theColors
    
        if (event.target.value==="") { return
        } else if (checkIntInRange(theInput, 0, theColors.length)) {
            this.setState({pseudoRandomCountInput: Number(event.target.value)})
        } else {
            this.pseudoRandomCountInput.current.value = pseudoRandomCount
        }
    }

    editColor(event) {
        let colorNumber = Number(event.target.id.slice(-1))
        let theColors = this.state.theColors
        this.setState( {editingColorNum: colorNumber, editingColor: theColors[colorNumber]} )
    }

    closeEditMenu() {
        this.setState( {editingColorNum: null, editingColor: null, addingColor: false} )
    }

    saveColorEdits(event) {
        let colorNumber = Number(event.target.id.slice(-1))
        let theColors = this.state.theColors
        if (event.target.id==="save-new-color") {
            colorNumber = theColors.length
            console.log("g'day")
        }
        theColors[colorNumber] = {
            red: Number(this.redInput.current.value),
            green: Number(this.greenInput.current.value),
            blue: Number(this.blueInput.current.value),
            name: this.nameInput.current.value
        }
        this.setState({theColors: theColors, editingColorNum: null, editingColor: null, addingColor: false})
    }

    colorInputChange(event) {
        let editingColor = this.state.editingColor
        let currentColor = event.target.id.slice(0,3)
        let inputNum = Number(event.target.value)
        if (currentColor==="gre") {
            currentColor = "green"
        } else if (currentColor==="blu") {
            currentColor = "blue"
        }

        if (event.target.value==="") { return 
        } else if (checkIntInRange(inputNum, -1, 256)) {
            editingColor[currentColor] = inputNum
            this.setState({editingColor: editingColor})
        } else {
            if (currentColor==="red") this.redInput.current.value = editingColor.red
            if (currentColor==="green") this.greenInput.current.value = editingColor.green
            if (currentColor==="blue") this.blueInput.current.value = editingColor.blue
        }
    }

    openAddColor() {
        let addingColor = this.state.addingColor
        if (!addingColor) {
            this.setState({addingColor: true, editingColorNum: null, editingColor: {}})
        } else {
            this.saveColorEdits({target: {id: "save-new-color"}}) //this is hacky
        }
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

function checkIntInRange(input, min, max) { //input as a STRING!!!
    if (
        input==="" ||
        (typeof(input)==="number" &&
        input%1===0 &&
        input > min &&          //EXCLUSIVE
        input < max)
    ) {
        return true
    } else {
        return false
    }
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
//  *weighting