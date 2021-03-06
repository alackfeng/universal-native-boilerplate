import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import {
  addNavigationHelpers,
} from 'react-navigation';
import getAction from './getAction';

/**
 * Enables URL support in browser
 */
export default (NavigationAwareView) => {
  const initialAction = getAction(
    NavigationAwareView.router,
    typeof window !== 'undefined' ? window.location.pathname.substr(1) : ''
  );

  class NavigationContainer extends Component {
    static propTypes = {
      state: PropTypes.object,
      dispatch: PropTypes.func,
    }
    static childContextTypes = {
      getActionForPathAndParams: PropTypes.func.isRequired,
      getURIForAction: PropTypes.func.isRequired,
    };
    getChildContext() {
      return {
        getActionForPathAndParams: this.getActionForPathAndParams,
        getURIForAction: this.getURIForAction,
      };
    }
    componentWillMount() {
      // when component first mounts, app is ready. navigate to initial route.
      const {
        dispatch,
      } = this.props;
      dispatch(initialAction);
    }
    componentDidMount() {
      const {
        dispatch,
        state,
      } = this.props;
      // set webpage title when page changes
      if (typeof document !== 'undefined') {
        let title = NavigationAwareView.router.getScreenOptions({
          state: state.routes[state.index],
          dispatch,
        }, 'title');
        
        // BUG: not show right title, 
        document.title = title ? title.title : document.title;
        console.log("----- URIWrapper.js::NavigationContainer - title - ", document.title);

      }
      // when url is changed, dispatch action to update view
      if (typeof window !== 'undefined') {
        window.onpopstate = (e) => {
          e.preventDefault();
          const action = getAction(NavigationAwareView.router, window.location.pathname.substr(1));
          if (action) {
            dispatch(action);
          }
        };
      }
    }
    componentWillUpdate(nextProps) {
      const {
        dispatch,
        state,
      } = nextProps;
      const {
        path,
      } = NavigationAwareView.router.getPathAndParamsForState(state);
      const uri = `/${path}`;

      // update url to match route state
      if (typeof window !== 'undefined' && window.location.pathname !== uri) {
        window.history.pushState({}, state.title, uri);
      }
      // set webpage title when page changes
      let title = NavigationAwareView.router.getScreenOptions({
        state: state.routes[state.index],
        dispatch,
      }, 'title');

      // BUG: not show right title, 
      document.title = title ? title.title : document.title;
      console.log("----- URIWrapper.js::NavigationContainer - title ", uri, state.title, document.title);
    }
    getURIForAction = (action) => {
      console.log("----- URIWrapper.js::NavigationContainer - getURIForAction - ", action.type);

      const state = NavigationAwareView.router.getStateForAction(action, this.state) || this.state;
      const {
        path,
      } = NavigationAwareView.router.getPathAndParamsForState(state);
      return `/${path}`;
    }
    getActionForPathAndParams = (path, params) => {
      console.log("----- URIWrapper.js::NavigationContainer - getActionForPathAndParams - ", path, params);
      return NavigationAwareView.router.getActionForPathAndParams(path, params);
    }
    render() {
      const {
        state,
        dispatch,
      } = this.props;
      return (
        <NavigationAwareView
          navigation={addNavigationHelpers({
            state,
            dispatch,
          })}
        />
      );
    }
  }

  return NavigationContainer;
};
