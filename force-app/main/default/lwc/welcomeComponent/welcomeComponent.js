import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLoggedInUserName from '@salesforce/apex/UserInfoController.getLoggedInUserName';
import getBranchRecordsForCurrentUser from '@salesforce/apex/BranchRecordsController.getBranchRecordsForCurrentUser';


export default class WelcomeComponent extends LightningElement {

    //로그인시
    loggedInUserName; // 로그인한 사용자의 이름을 저장할 속성

    @wire(getLoggedInUserName)
    wiredUserName({ error, data }) {
        if (data) {
            this.loggedInUserName = data; // 사용자의 이름을 속성에 저장합니다.
            this.showToast(this.loggedInUserName);
        } else if (error) {
            console.error('Error fetching logged in user info:', error);
            this.showToastError();
        }
    }

    showToast(userName) {
        const evt = new ShowToastEvent({
            title: "환영합니다",
            message: `${userName}님, 안녕하세요!`,
            variant: "success",
            duration: 3000 // 3초 동안 표시
        });
        this.dispatchEvent(evt);
    }
    
    showToastError() {
        const evt = new ShowToastEvent({
            title: "오류",
            message: "사용자 정보를 가져오는 데 문제가 발생했습니다.",
            variant: "error",
            duration: 3000 // 3초 동안 표시
        });
        this.dispatchEvent(evt);
    }

    //로그인한 담당지점 보여주기
    @track branches = [];

    @wire(getBranchRecordsForCurrentUser)
    wiredBranches({ error, data }) {
        if (data) {
            this.branches = data;
        } else if (error) {
            console.error('Error:', error);
        }
    }
}