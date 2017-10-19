'use strict';
import { window, Disposable } from "vscode";
import { MaintainabilityIndex } from './maintainabilityindex';

export class MaintainabilityIndexController {
    
        private _maintainabilityIndex: MaintainabilityIndex;
        private _disposable: Disposable;
    
        constructor(theIndex: MaintainabilityIndex) {
            this._maintainabilityIndex = theIndex;
    
            // subscribe to selection change and editor activation events
            let subscriptions: Disposable[] = [];
            window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
            window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
    
            // update the counter for the current file
            this._maintainabilityIndex.updateMaintainabilityIndex();
    
            // create a combined disposable from both event subscriptions
            this._disposable = Disposable.from(...subscriptions);
        }
    
        dispose() {
            this._disposable.dispose();
        }
    
        private _onEvent() {
            this._maintainabilityIndex.updateMaintainabilityIndex();
        }
    }
    
    