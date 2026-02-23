public with sharing class LeaveRequstController {
    @AuraEnabled(cacheable=true)
    public static List<LeaveRequest__c> getMyLeaves(){
        try {
            List<LeaveRequest__c> myLeaves=new List<LeaveRequest__c>();
            myLeaves=[SELECT Id,Name,From_Date__c,To_Date__c,Reason__c,Status__c,Manager_Comment__c FROM LeaveRequest__c WHERE User__c=:UserInfo.getUserId() ORDER BY CreatedDate DESC];
            return myLeaves;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<LeaveRequest__c> getLeaveRequests(){
        try {
            List<LeaveRequest__c> myLeaves=new List<LeaveRequest__c>();
            myLeaves= [
        SELECT Id, Name, User__c, User__r.Name,
               From_Date__c, To_Date__c, Reason__c,
               Manager_Comment__c, Status__c
        FROM LeaveRequest__c
        WHERE Status__c = 'Pending'
        ORDER BY CreatedDate DESC
    ];


            return myLeaves;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}