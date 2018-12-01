import { Component } from '@angular/core';
import * as _ from "lodash";
import { ElementSchemaRegistry } from '../../node_modules/@angular/compiler';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  newEmpName: String = "";
  newEmpLogin: String = "";
  errorMessage: String = "";
  activeTabLogin: String = "";
  showMore: boolean = false;
  userTabActive: boolean = false;

  /*!
 * --------------------------------------- START OF LICENSE NOTICE ------------------------------------------------------
 * Copyright (c) 2018 Software Robotics Corporation Limited ("Soroco"). All rights reserved.
 *
 * NO WARRANTY. THE PRODUCT IS PROVIDED BY SOROCO "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL SOROCO BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE PRODUCT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 * ---------------------------------------- END OF LICENSE NOTICE -------------------------------------------------------
 *
 *   Candidate: FULL NAME - <EMAIL ID>
 *   Purpose: Soroco Front-end hands on assignment
 */


  /*
     Function to render existing tab, can be called anywhere in the application with a user object of type { "name": "", "login": }
  */
  states = {
    tabsList: [], // list of tabs
    activeTabsList: [], // list of visible tabs
    inactiveTabsList: [] // list of hidden tabs
  }

  renderTab(user) {
    let containerWidth = document.getElementById("tab-container").offsetWidth;
    let dynamicWidth = document.getElementById("dynamic-tabs").offsetWidth;
    let fixWidth = document.getElementById("fixed-tab").offsetWidth;
    if ((dynamicWidth + fixWidth)/containerWidth > .70) { // add conditions to support dynamic width of tabs
      // combined width of tabs are more than allowed
      this.renderSeeMore(user);
    } else {
      this.setActiveTab(user);
      this.states.activeTabsList.push(user);
    }
  }
  loginAlreadyExists(login) {
    let emp = _.find(this.states.tabsList, function (tab) {
      return tab.login == login;
    });
    if (emp)
      return true;
    else
      return false;
  }
  /*
     Function to create a new tab and takes values from the input fields on UI
  */
  createTab() {
    if (!this.newEmpName || !this.newEmpLogin) {
      this.errorMessage = "Please fill both fields in order to proceed.";
      return;
    }
    else if (this.loginAlreadyExists(this.newEmpLogin)) {
      this.errorMessage = "Login ID already exists. Please try with a different ID.";
      return;
    }
    this.errorMessage = "";
    let user = {
      'name': this.newEmpName,
      'login': this.newEmpLogin
    }

    this.states.tabsList.push(user); // append newly created tab to "tabsList"
    this.renderTab(user);

    // reset "Add transaction" fields
    this.newEmpName = "";
    this.newEmpLogin = "";
  }

  /*
     Function to close a tab
  */
  closeTab(user) {
    if(user.login == this.activeTabLogin){
      this.setActiveTab('');
    }
    _.remove(this.states.tabsList, function (tab) {
      return tab.name == user.name && tab.login == user.login;
    });
    _.remove(this.states.activeTabsList, function (tab) {
      return tab.name == user.name && tab.login == user.login;
    });
  }

  /*
     Function to set a particular tab-heading as active when clicked on it
  */
  setActiveTab(user) {
    if (user) {
      this.activeTabLogin = user.login;
      this.userTabActive = true;
    }
    else {
      this.activeTabLogin = "";
      this.userTabActive = false;

    }
  }

  /*
     Function to fetch/render tab details of particular tab while switching between tabs
  */
  getTabDetails() {
    let message = `Hi ${this.getActiveUser()}`;
    return message;
  }


  /*
     Function to render See more tabs when the length of tabs is more than 3. Please try to make this based on the screen width available
     and compute the number of tabs to be visible on the screen accordingly.
  */
  renderSeeMore(user) {

    this.states.inactiveTabsList.push(user);
  }
  getActiveUser() {
    let activeUser = _.find(this.states.tabsList, { 'login': this.activeTabLogin });
    return activeUser.name;
  }
  /*
     Function to populate the see more menu dropdown list
  */
  populateDropdown() {
    // $('#more-list').html('');
    // for (var i = 3; i < this.states.tabsList.length; i++) {
    //   let temp =
    //   `<div class="more-list-item">
    //     <div class="list-item1">` + this.states.tabsList[i].name + `</div>
    //     <div class="list-item2">` + this.states.tabsList[i].login + `</div>
    //   </div>`;
    //   $("#more-list").append(temp);
    // }
  }

  /*
     Function to show/hide the dropdown list when Seem more tab is clicked
  */
  toggleDropdown() {
    this.showMore = !this.showMore
  }

  /*
     Function to switch to a tab selected from the see more list and set it as the active tab visible on the screen,
    while one of the tabs earlier visible on the screen gets added to the dropdown list
  */
  switchDropdown(user) {
    let userToBeHidden = this.states.activeTabsList.pop();
    this.states.activeTabsList.push(user);
    this.setActiveTab(user);
    _.remove(this.states.inactiveTabsList, function (n) {
      return n.login == user.login;
    });
    this.states.inactiveTabsList.push(userToBeHidden);
  }

}
