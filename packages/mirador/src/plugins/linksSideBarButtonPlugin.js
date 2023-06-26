import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import MenuItem from '@material-ui/core/MenuItem';
// import DownloadIcon from '@material-ui/icons/VerticalAlignBottomSharp';
import { getManifestUrl } from 'mirador/dist/es/src/state/selectors/manifests';

const mapStateToProps = (state, { windowId }) => ({
  manifestUrl: getManifestUrl(state)
});

class MiradorLinksSideBarButton extends Component {
  render() {
    return (
      <React.Fragment>
        <p>
          { manifestUrl }
        </p>
      </React.Fragment>
    );
  }
}

MiradorLinksSideBarButton.propTypes = {
  manifestUrl: PropTypes.string.isRequired
};

export default {
  target: 'WindowSideBarButtons',
  mode: 'add',
  name: 'MiradorLinksSideBarButtonPlugin',
  component: MiradorLinksSideBarButton,
  mapStateToProps
};
