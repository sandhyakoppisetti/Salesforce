import { LightningElement } from 'lwc';

export default class LeaveTracker extends LightningElement {
    refreshLeaveRequestHandler(event){
    
        this.refs.myLeavesComp.refreshGrid();
    }
}