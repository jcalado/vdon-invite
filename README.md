# obsninja-invite

Invite link generator for the [obs.ninja](https://obs.ninja) website.
Add panels or change the order by tweaking `data.json`.
Steve keeps a copy under [invite.obs.ninja](https://invite.obs.ninja) (thanks Steve!) or you can directly access the code of this repo under [jcalado.github.io/obsn-invite](http://jcalado.github.io/obsn-invite).

## Data format

The data json is an Array of entries following this format:

````json
{
    "title": "Sharing types",
    "description": "Limit the types of content your guests are allowed to share.",
    "answers": [
        {
            "label": "Allow all",
            "type": "radio",
            "params": "",
            "group": "allowed_devices",
            "selected": true
        }
    ]
}
````


`title` is self explanatory.  
`description` Shows when clicking the information icon on each panel.    
`label` is self explanatory.  
`"type": "radio"` for radio buttons. Use with unique `group` strings.
`"type": "toggle"` for single on/off params.  
`"type": "text"` for text user input params, such as filters, labels, etc.   
`params` is the param name in question, eg: `"&autostart"`.  
`selected` can be `true` or `false`. Use with radio buttons to set default value.

## Thanks to
AES.js - URL obfuscation - [Site](https://code.google.com/p/crypto-js)  
randomName.js - Random room name generation - [Site](https://code.google.com/p/crypto-jshttps://gist.github.com/tkon99/4c98af713acc73bed74c)
