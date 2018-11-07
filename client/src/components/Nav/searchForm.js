import React, { Component } from 'react';

class SearchForm extends Component {
  state = { 
    searchText: ''
  }

  onSearchChange = e => {

    const searchText = e.target.value.toLowerCase();
    this.setState({ searchText });
  }

  handleSubmit = e => {
    const { searchText } = this.state; 
    
    e.preventDefault();
    this.props.onSearch(searchText, '/search');
    e.currentTarget.reset();
  }

  render() { 
    return ( 
      <form className="form-inline my-lg-0 search" onSubmit={this.handleSubmit}>
        <input 
          className="form-control mr-sm-2" 
          type="search" 
          placeholder="Search topic" 
          aria-label="Search" 
          onChange={this.onSearchChange}
        />
      </form>
     );
  }
}
 
export default SearchForm;