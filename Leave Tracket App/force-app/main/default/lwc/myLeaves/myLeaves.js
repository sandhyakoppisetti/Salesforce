import { LightningElement, wire } from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequstController.getMyLeaves';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';  
import { refreshApex } from '@salesforce/apex';


const COLUMNS=  [
    {label: 'Request Id', fieldName:'Name', cellAttributes: { class: { fieldName: 'cellClass'}} },
    {label: 'User', fieldName:'userName', cellAttributes: { class: { fieldName: 'cellClass'}} },
    {label: 'From Date', fieldName:'From_Date__c', cellAttributes: { class: { fieldName: 'cellClass'}} },
    {label: 'To Date', fieldName:'To_Date__c',cellAttributes: { class: { fieldName: 'cellClass'}} },
    {label: 'Reason', fieldName:'Reason__c', cellAttributes: { class: { fieldName: 'cellClass'}} },
    {label: 'Manager Comment', fieldName:'Manager_Comment__c', cellAttributes: { class: { fieldName: 'cellClass'}} },
    {type:"button",typeAttributes:{
        label:'Edit',
        name:'Edit',
        title:'Edit',
        value:'Edit' ,
        disabled:{fieldName:'isEditDisabled'}
    }, cellAttributes: {class:{ fieldName: 'cellClass'}}
}   
    ];
export default class MyLeaves extends LightningElement {
    columns=COLUMNS;
    myLeaves = [];
    myLeavesWireResult;
    showModalPopup = false;
    objectApiName = 'LeaveRequest__c';
    recordId = '';
    currentUserId = Id;

    @wire(getMyLeaves)
    wiredMyLeaves(result) {
        this.myLeavesWireResult = result;
       if(result.data){
           this.myLeaves = result.data.map(a => ({
            ...a,
            userName: a.User__r?.Name||'',
            cellClass: a.Status__c == 'Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' : '',
            isEditDisabled: a.Status__c != 'Pending'
           }));
       }
       if(result.error){
            console.log('Error occured while fetching my leaves-',result.error);
       }
    }
    get noRecordFound() {
        return this.myLeaves.length == 0;

    }
    newRequestClickHandler() {
        this.recordId = '';
        this.showModalPopup = true;
    }
    popupCloseHandler() {
        this.showModalPopup = false;
    }
    rowActionHandler(event) {
        this.showModalPopup = true;
        this.recordId = event.detail.row.Id;
    }
    successHandler(event) {
        this.showModalPopup = false;
        this.showToast('Leave request updated successfully');
        refreshApex(this.myLeavesWireResult);
        const refreshEvent = new CustomEvent('refreshleaverequests');
        this.dispatchEvent(refreshEvent);
    }
    submitHandler(event){
        event.preventDefault();
        const fields = {...event.detail.fields};
        fields.Status__c = 'Pending';
        fields.User__c = this.currentUserId;

        if(new Date(fields.From_Date__c) > new Date(fields.To_Date__c)){
            this.showToast('From date cannot be greater than To date','Error','error');
            
        }
        else if( new Date()> new Date(fields.From_Date__c)) {
            this.showToast('From date cannot be in the past','Error','error');
        }
        else{
           this.refs.leaveRequestFrom.submit(fields);
        }
    }
    showToast(message,title='Success',variant='success') {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

}
