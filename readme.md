# Voting Booth

This is a fully configurable voting component

  - Compatible with all modern browsers including Android and iOS mobile and tablet devices.
  - Uses CSS3 transitions to ensure the performance and compatibility of the animations.
  - Component is designed to fill the width and height of the window so it will work fine in iframes.



Version
-----------

0.1.0


Bugs
-----------
* No bug reported so far.


Notes
-----------
* Voting PHP Service might not be alive so please check the code structure


Configuration
-----------

* You can customize the number of questions, text labels, values, loading screen, show the resuts in % or show the number of votes.

```javascript

var APP_CONF = {
  // this has to be an unique id
  question_id: "dummy_question_1",

  // will affect the spinner and spinner bg overlay
  loader: {
    bgColor: "rgba(255,255,255,0.5)",
    spinnerColor: "black",
    test: false // set it to true if you want the loading screen to hang on the screen
  },

  // this will affect the main container of the component
  container: {
    styles: {
      "background-color": "white"
    }
  },

  // each item contains a question and a result
  // question data will be shown on the initial screens when asking the user to vote
  // result text will be shown after the user votes, it will contain the data returned from the database
  // you can add as many items as you want, just make sure the key name for each is unique: "yes", "no", "maybe", etc 
  items: {
    "yes": {
      question: {
        styles: {
          "background-color": "#569c42",
          "color": "white",
          "text-shadow": "0 2px 2px rgba(0, 0, 0, 0.5)",
          "border-radius": "10px",
        },
        text: "like whiskey?",
      },
      result: {
        styles: {
          "background-color": "#eeeeee",
          "color": "orange",
          "text-shadow": "0 1px 1px rgba(0, 0, 0, 0.2)",
          "font-size": "20px"
        },
        text: "{%}% of people like whiskey",
        // no_votes_text: "no one like whiskey"
      }
    },
    "no": {
      question: {
        styles: {
          "background-color": "rgba(215, 40, 40, 0.9)",
          "color": "yellow",
          "text-shadow": "0 1px 1px rgba(0, 0, 0, 0.5)",
          "border-radius": "10px"
        },
        text: "hate whiskey?",
      },
      result: {
        styles: {
          "background-color": "#eeeeee",
          "color": "red",
          "text-shadow": "0 1px 1px rgba(0, 0, 0, 0.2)",
          "font-size": "20px"
        },
        text: "{%}% of people don't like whiskey",
        // no_votes_text: "no one hate whiskey"
      }
    },
  }
};

```


How to use:
--------------

Just call the load() method after chainging the configuration or at load time.

```javascript

APP.load();

```

---

License
----

Created By Ian Calderon for Say Media. For any feedback or bug reports please contact me: icalderon@saymedia.com

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;