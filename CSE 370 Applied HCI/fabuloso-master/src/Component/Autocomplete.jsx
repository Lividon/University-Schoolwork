import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import '../Dustin.css'


class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: [],
    inputClass: "",
    form: "",
    placeholder: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: ""
    };
  }


  // Event fired when the input value is changed
  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
    let filteredSuggestions = suggestions;
    if (this.props.changeInputHandler) {
      this.props.changeInputHandler(userInput, this.props.form)
    }


    // Filter our suggestions that don't contain the user's input
    if (suggestions) {
      filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion.attributes.username.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );
    } else {

    }
    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value

    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    // Update the user input and reset the rest of the state
    const input = e.currentTarget.innerText
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: input
    });
    if (this.props.changeInputHandler) {
      this.props.changeInputHandler(input, this.props.form)
    }
    let selectedId = e.currentTarget.id;
    this.props.selectAutocomplete(selectedId)
    console.log("Friend selected is " + selectedId);
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      if (this.state.showSuggestions && filteredSuggestions.length != 0) {
        e.preventDefault()
        const input = filteredSuggestions[activeSuggestion].attributes.username
        console.log(filteredSuggestions[activeSuggestion])
        this.setState({
          activeSuggestion: 0,
          showSuggestions: false,
          userInput: input
        });
        if (this.props.changeInputHandler) {
          this.props.changeInputHandler(input, this.props.form)
        }
        let selectedId = filteredSuggestions[activeSuggestion].id
        this.props.selectAutocomplete(selectedId)
      }else{
        this.setState({
          showSuggestions: false,
        })
      }
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  onBlur = e => {
    console.log("blur")
    this.setState({
      showSuggestions: false,
    })
    return
  }

  onMouseDown = e => {
    e.preventDefault()
  }

  render() {
    const {
      onMouseDown,
      onChange,
      onClick,
      onKeyDown,
      onBlur,
      state: { activeSuggestion, filteredSuggestions, showSuggestions, userInput }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <div className="autocomplete">
            <ul className="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;

                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }

                return (
                  <li className={className} key={suggestion.id} id={suggestion.id} onClick={onClick} onMouseDown={onMouseDown}>
                    {suggestion.attributes.username}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      } else {
        suggestionsListComponent = (
          <Fragment>
            <div><em>No users suggestions found</em></div>
            <div className="autocomplete" style={{display: "none"}}>
            </div>
          </Fragment>
        );
      }
    } else {
      suggestionsListComponent = <div className="autocomplete" style={{display:"none"}} />;
    }

    return (
      <Fragment>
      <div className="autocomplete-container">
        <input
          className={this.props.inputClass}
          placeholder={this.props.placeholder}
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          value={userInput}
        />
        {suggestionsListComponent}
      </div>
      </Fragment>
    );
  }
}

export default Autocomplete;
