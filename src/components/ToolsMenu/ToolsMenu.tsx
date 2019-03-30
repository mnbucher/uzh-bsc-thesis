import React from 'react';
import './ToolsMenu.css';
import ToolsMenuVNFList from './ToolsMenuVNFList/ToolsMenuVNFList';
import ToolsMenuDropZone from './ToolsMenuDropZone/ToolsMenuDropZone';
import {connect} from "react-redux";
import {SFCPackageState, StoreState} from "../../types";
import { Dispatch } from 'redux';
import { handleSFCPopup } from 'src/actions';

class ToolsMenu extends React.Component<{sfcPackageState: SFCPackageState, handleSFCPopup: any}> {

    concatUUIDsForURL = () => {
        const uuids = this.props.sfcPackageState.vnfPackages.map(vnfPackage => vnfPackage.uuid);
        if (uuids.length > 0) {
            let path = "";
            uuids.forEach((uuid, index) => {
                if (index == 0) {
                    path = path.concat("?uuids[]=" + uuid);
                }
                else {
                    path = path.concat("&uuids[]=" + uuid);
                }
            });
            return path;
        }
        return "";
    }

    generateSFCPackage = () => {
        this.props.handleSFCPopup(true);
    }

    render() {
        return (
            <div className="tools-menu-wrapper">

                <div className="geneviz-header">
                    <p className="geneviz-headline">Geneviz</p>
                </div>

                <div className="tools-menu-inner-wrapper">
                    <div className="tools-menu">
                        <div className="tools-menu-header"><p>Imported VNF Packages</p></div>
                        <div className="tools-menu-vnfs">
                            <ToolsMenuVNFList />
                            <ToolsMenuDropZone />
                        </div>

                        <div className='tools-menu-download-sfc'>
                            <button onClick={this.generateSFCPackage}>Generate SFC Package</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export function mapStateToProps(state: StoreState) {
    return {
        sfcPackageState: state.sfcPackageState
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        handleSFCPopup: (showSFCPopup: boolean) => {
            dispatch(handleSFCPopup(showSFCPopup));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenu);