// Add a specified delay in miliseconds
const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

// Write text to a target element with a specified delay in ms
function writeText(target, content, delay = 5) {
    // Loop through array of content characters
    return new Promise((resolve) => {
        // Make an array of the specified content
        const contentArray = content.split('')

        // Keep track of the character currently being written
        let current = 0

        while (current < contentArray.length) {
            ; ((curr) => {
                setTimeout(() => {
                    target.innerHTML += contentArray[curr]
                    // Scroll to the bottom of the screen unless scroll is false
                    window.scrollTo(0, document.body.scrollHeight)

                    // Resolve the promise once the last character is written
                    if (curr === contentArray.length - 1) resolve()
                }, delay * curr) // increase delay with each iteration
            })(current++)
        }
    })
}

// Handle keypresses on the document, printing them to an
// 'input' span. Input content will be interpreted as a
// command and output will be written to an output element
function handleKeypress(e, input, output) {
    // Check if a certain type of element has focus that we do not
    // want to do keypress handling on (such as form inputs)
    function noInputHasFocus() {
        const elements = ['INPUT', 'TEXTAREA', 'BUTTON']
        return elements.indexOf(document.activeElement.tagName) === -1
    }

    if (noInputHasFocus) {
        // Enter clears the input and executes the command
        if (e.key === 'Enter') {
            const command = input.innerText
            input.innerHTML = ''
            // reprint the entered command
            output.innerHTML += '<br><strong>' + command + '</strong>\n<br>'
            writeText(output, execute(command))
        }
        // Backspace causes last character to be erased
        else if (e.key === 'Backspace') {
            input.innerHTML = input.innerHTML.substring(0, input.innerHTML.length - 1)
        }
        // For any other key, print the keystroke to the prompt
        else input.insertAdjacentText('beforeend', e.key)
    }

    // Accept a command, execute it, and return any output
    function execute(command) {
        switch (command.toLowerCase()) {
            case '':
                return `\n`

            case 'clear':
                asciiText.style.display = 'none'
                output.innerHTML = ''
                return ''

            case 'test':
                return 'Test successful!'
            case 'info':
                return 'Hello! Thank you for visiting my website, currently it does not do much, \n but it will in the future!'

            case 'help':
                return `Enter a command here and something will be output.
            
  Valid options are:
   help - this help text
   clear - clear the screen
   test - display a test message
   info - display website information`

            default:
                return 'Unknown command'
        }
    }
}

// Execute page loading asynchronously once content has loaded
document.addEventListener('DOMContentLoaded', async () => {
    const asciiText = document.getElementById('asciiText')
    // Store the content of asciiText, then empty it
    const asciiArt = asciiText.innerText
    asciiText.innerHTML = ''

    const instructions = document.getElementById('instructions')
    const prompt = document.getElementById('prompt')
    const cursor = document.getElementById('cursor')

    await wait(1000)
    await writeText(asciiText, asciiArt)
    await wait(500)
    await writeText(instructions, `Enter a command. Enter 'help' to see a list of commands.`)
    prompt.prepend('>')
    //Modify this to change cursor character
    cursor.innerHTML = '_'

    const input = document.getElementById('command-input')
    const output = document.getElementById('output')
    document.addEventListener('keydown', (e) => handleKeypress(e, input, output))
})
