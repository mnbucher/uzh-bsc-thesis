import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { StoreState, VNFTemplateState } from "../../../types";
const JSZip = require("jszip");
import uuidv1 from 'uuid';
import './ToolsMenuDropZone.css';
import { connect } from "react-redux";
import { uploadVNFTemplate } from "../../../actions";
import { Dispatch } from "redux";

class ToolsMenuDropZone extends React.Component<{addVNF: any, vnfTemplateState: VNFTemplateState[]}> {

    isAlreadyAdded = (fileBase64: string) => {
        const currentVNFs = this.props.vnfTemplateState as VNFTemplateState[];
        let sameFileWasFound: boolean = false;

        currentVNFs.map((vnf) => {
            if (vnf.fileBase64 == fileBase64 as string){
                console.log("already exists!");
                sameFileWasFound = true;
            }
        });

        return sameFileWasFound;
    }

    onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            const fileName = file.name.replace(".zip", "");

            reader.onload = () => {
                const zipAsBinaryString = reader.result;
                let zip = new JSZip();

                zip.loadAsync(zipAsBinaryString).then((zipFile: any) => {
                    zipFile.generateAsync({type:"base64"}).then((fileBase64: string) => {

                        let vnfTemplate: VNFTemplateState = {
                            name: fileName,
                            fileBase64: fileBase64,
                            uuid: uuidv1()
                        };
                        this.isAlreadyAdded(fileBase64 as string) ? alert('This File was already added!') : this.props.addVNF(vnfTemplate);
                    });
                });
            };
            reader.readAsBinaryString(file);
        });
    }

    render() {
        return (
            <div className="toolsMenu-add-vnfs">
                <Dropzone onDrop={this.onDrop} accept="application/zip">
                    {({getRootProps, getInputProps, isDragActive}) => {
                        return (
                            <div
                                {...getRootProps()}
                                className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                            >
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop files here...</p> :
                                        <p>Upload a VNF Package (only .ZIP files allowed) by dropping the file directly here or by clicking here to select a file.</p>
                                }
                            </div>
                        )
                    }}
                </Dropzone>
            </div>
        );
    }
}


export function mapStateToProps(state: StoreState) {
    return {
        vnfTemplateState: state.vnfTemplateState
    }
}

export function mapDispatchToProps(dispatch: Dispatch) {
    return {
        addVNF: (vnfTemplate: VNFTemplateState) => {
            dispatch(uploadVNFTemplate(vnfTemplate));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsMenuDropZone);