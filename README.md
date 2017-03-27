# mouse-killer
An Angular.JS directive to bind keyboard shortcuts to buttons (or any other DOM element).

## Should I use this?
If your shortcuts have a strong relationship with DOM elements (like buttons), so probably you want to use this. 

The rule of thumb is:

* If you have a relationship of 1:1 between DOM elements and shortcuts, you probably want to use Mouse Killer.
* If not, maybe there's a better option for you.

Or: 

* If your shortcuts are binded to buttons and you only want to trigger the shortcut if the button can be clicked (ie. it's not disabled, it's not hidden and it's not overrided by other element), so you really want to use Mouse Killer.
* If not, maybe there's a better option for you.

Or even:

* If you prefer to define the shortcuts directly in you HTML tags, you should consider using Mouse Killer.
* If you prefer to define the shortcuts in your controller, you should consider using another plugin.

Not sure if Mouse Killer is the option that best suit your needs? So take a look at [angular-hotkeys](https://github.com/chieffancypants/angular-hotkeys) which has a different approach.

## Installation

1. Download `mouse-killer.js` file and place it somewhere in your project.

2. Include `mouse-killer.js` in your HTML: 
    
        <script src="/path/to/mouse-killer.js"></script>

3. Add **mouseKiller** as a dependency to your app:

        angular.module('myApp', [
            'mouseKiller'
        ])

## Usage
Complete example: 

    <button 
        mk-shortcut="ctrl + enter"
        mk-hint-type="title"
        mk-title-text="The shortcut for this button is %"
        mk-event="click">Button</button>

| Attribute     | Required | Default     | Description |
|---------------|----------|-------------|-------------|
| mk-shortcut   | Yes      | -           | The key combination (see below). |
| mk-hint-type  | No       | title       | `none` doesn't display a hint for the shortcut. <br />`title` display the shortcut in the *title* attribute of the element. <br />`inline` appends the shortcut to the inner text of the element. Example: **Button text** becomes **Button text (F8)** |
| mk-title-text | No       | Shortcut: % | If mk-hint-type is set to title, this attribute defines how the title will be. The character `%` will be replaced by the shortcut. |
| mk-event      | No       | click       | The event to be triggered on the element when the shortcut is pressed. |

### Directive default configuration
You can use the `.config()` of your application to set the directive default parameters (that can be overrided by some attribute).

In the code below you can see all the three parameters that can be set.

    app.config(['mouseKillerConfigProvider', function(mouseKillerConfigProvider) {
        mouseKillerConfigProvider.setHintType('title');
        mouseKillerConfigProvider.setTitleText('Be faster using the % shortcut');
        mouseKillerConfigProvider.setEvent('focus');
    }]);

### Non-overridable shortcuts
Mouse Killer prevents the browser default action for a given shortcut. For example, if you define `ctrl+o` as a shortcut in your application, Mouse Killer will prevent the browser from openning a file.

For security reasons, there are some shortcuts that can't be prevented and it varies by browser. For example, Google Chrome won't let you override the `ctrl+n` shortcut. 

### Valid shortcuts
Keys in a key combination should be separated by the `+` character. In your shortcut, you can have:
* Any number of modifier keys
* Zero or one normal key

Examples of valid shortcuts:
* `ctrl+enter`
* `ctrl+alt+k`
* `w`
* `Ctrl` (shortcuts are case-insensitive)
* `CTRL + Shift+ F` (shortcuts are "space-insensitive")
* `ctrl + {32}` (use `{xxx}` to specify a key by its key code)

#### Modifiers
The following strings are considered modifiers keys:

| Modifier keys        |
|----------------------|
| `ctrl`               |
| `alt`                |
| `shift`              |
| `meta` (Windows key) |

#### Keys
| Letters |   | Numbers | Numpad | Fx | Misc. |
|---------|---|---------|--------|----|-------|
| a | n | 0 | numpad 0 | f1 | backspace |
| b | o | 1 | numpad 1 | f2 | tab |
| c | p | 2 | numpad 2 | f3 | enter |
| d | q | 3 | numpad 3 | f4 | esc |
| e | r | 4 | numpad 4 | f5 | page up |
| f | s | 5 | numpad 5 | f6 | page down |
| g | t | 6 | numpad 6 | f7 | end |
| h | u | 7 | numpad 7 | f8 | home |
| i | v | 8 | numpad 8 | f9 | left arrow |
| j | w | 9 | numpad 9 | f10 | up arrow |
| k | x |   | multiply | f11 | right arrow |
| l | y |   | add | f12 | down arrow |
| m | z |   | subtract |  | insert |
|   |   |   | decimal point |  | delete |
|   |   |   | divide |  |  |



## License
MIT
