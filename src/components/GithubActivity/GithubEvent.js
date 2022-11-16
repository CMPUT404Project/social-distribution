/**
 * Took inspiration from here https://github.com/caseyscarborough/github-activity
 * Some of the logic and templates were used
 * The above repo did not work for React so 
 * I made my own basing it off of this
 */

import React, { Component } from 'react'
import parse from 'html-react-parser';

export default class GithubEvent extends Component {
    renderTypes(data) {
        var payload = data.payload;
        let icon;
        let branch = {
            branchName: "",
            branchUrl: ""
        };
        let action;
        let comment = {
            commentBody: "",
            commentUrl: "",
            
        };
        let pullRequestEvent = {
            pullRequest: "",
            eventType: "",
            pullRequestEventType: "",
            pullRequestUrl: "",
            mergeMessage: "",
            reviewBody: ""
        };
        let commits = {
            commitsUrl: "",
            commitsMessage: "",
            commitComponents: ""
        };
        let fork = {
            forkName: "",
            forkUrl: ""
        };
        let issue = {
            action: "",
            title: "",
            issueUrl: "",
            issueType: ""
        }
        let gist = {
            actionType: "",
            gistUrl: ""
        }
        let gollum = {
            actionType: "",
            gollumUrl: ""
        }
        let release = {
            tagLink: "",
            zipLink: ""
        }
        let followTargetUrl = "";
        let memberUrl = "";
        let userGravatar = `<img className="user-gravatar" src="${data.actor.avatar_url}">`;

        if (data.type === 'CreateEvent' && (['repository', 'branch', 'tag'].indexOf(payload.ref_type) >= 0)) {
            icon = "octicon octicon-" + icons[data.type + '_' + payload.ref_type];
        } else if (data.type === 'PullRequestReviewEvent') {
            icon = "octicon octicon-" + icons[data.type + '_' + payload.review.state];
        } else {
            icon = "octicon octicon-" + icons[data.type]
        }

        if (data.type === "ForkEvent") {
            fork.forkName = payload.forkee.full_name
            fork.forkUrl = `https://github.com/${payload.forkee.full_name}`;
        }

        if (data.type === 'FollowEvent') {
            followTargetUrl = `https://github.com/${payload.target.login}`;
        }

        if (data.type === 'MemberEvent') {
            memberUrl = `https://github.com/${payload.member.login}`;
        }

        if (payload.pull_request) {
            pullRequestEvent.pullRequest = payload.pull_request;
            var title = data.repo.name + "#" + pullRequestEvent.pullRequest.number
            pullRequestEvent.pullRequestUrl = `<a href=${pullRequestEvent.pullRequest.html_url} target="_blank">${title}</a>`;
            pullRequestEvent.mergeMessage = "";
    
            if (payload.pull_request.merged) {
                pullRequestEvent.eventType = "merged";
                var message = `${pullRequestEvent.pullRequest.commits} ${pluralize('commit', pullRequestEvent.pullRequest.commits)} \
                                with ${pullRequestEvent.pullRequest.additions} ${pluralize('addition', pullRequestEvent.pullRequest.additions)} \
                                and ${pullRequestEvent.pullRequest.deletions} ${pluralize('deletion', pullRequestEvent.pullRequest.deletions)}`;
                pullRequestEvent.mergeMessage = `<br>
                                                    <small className="github-merge-message">
                                                        ${message}
                                                    </small>`;
            } else {
                data.eventType = "closed";
            }
    
            if (data.type === 'PullRequestReviewEvent') {
                pullRequestEvent.reviewBody = payload.review.body || "";
                if (payload.review.state === "commented") {
                    pullRequestEvent.eventType = "commented on";
                } else if (payload.review.state === "changes_requested") {
                    pullRequestEvent.eventType = "requested changes on";
                } else if (payload.review.state === "approved") {
                    pullRequestEvent.pullRequestEventType = "approved";
                }
            }
        }

        if (payload.comment && payload.comment.pull_request_url) {
            var title = data.repo.name + "#" + payload.comment.pull_request_url.split('/').pop();
            pullRequestEvent.pullRequestUrl = `<a href=${payload.comment.html_url} target="_blank">${title}</a>`;
        }


        if (payload.comment && payload.comment.body) {
            comment.commentBody = payload.comment.body;
            if (comment.commentBody.length > 150) {
                comment.commentBody = comment.commentBody.substring(0, 150) + '...';
            }
            if (payload.comment.html_url && payload.comment.commit_id) {
                var title = data.repo.name + '@' + payload.comment.commit_id.substring(0, 10);
                comment.commentUrl = `<a href=${payload.comment.html_url} target="_blank">${title}></a>`;
            }
        }

        if (payload.ref) {
            if (payload.ref.substring(0, 11) === 'refs/heads/') {
                branch.branchName = payload.ref.substring(11);
            } else {
                branch.branchName = payload.ref;
            }
            branch.branchUrl = `<a className="github-branch-url" href=${'https://github.com/' + data.repo.name + '/tree/' + branch.branchName} target="_blank">${branch.branchName}</a>`
        }

        if (payload.commits) {
            var shaDiff = payload.before + '...' + payload.head;
            var length = payload.commits.length;
            commits.commitsUrl = "https://github.com/" + data.repo.name + "/compare/" + shaDiff
            if (length === 2) {
                // If there are 2 commits, show message 'View comparison for these 2 commits >>'
                commits.commitsMessage = 'View comparison for these 2 commits &raquo'
            } else if (length > 2) {
                // If there are more than two, show message '(numberOfCommits - 2) more commits >>'
                commits.commitsMessage = length-2 + " more commits &raquo";
            } else {
                commits.commitsMessage = ""
            }
    
            payload.commits.forEach(function(commit, i) {
                if (commit.message.length > 66) {
                    commit.message = commit.message.substring(0, 66) + '...';
                }
                if (i < 2) {
                    commits.commitComponents += `<li>
                                                    <small>
                                                        <img className="commit-image" src="https://gravatar.com/avatar/" width="16" />
                                                        <a className="commit-link" href="https://github.com/${data.repo.name}/commit/${commit.sha}">${commit.sha.substring(0, 6)}</a>
                                                        <span classNames="commits-message">${commit.message}</span>
                                                    </small>
                                                </li>`
                } else {
                    payload.commits.splice(2, payload.size);
                }
            });
          }
        if (payload.issue) {
            var title = data.repo.name + "#" + payload.issue.number;
            issue.action = payload.action;
            issue.title = payload.issue.title;
            issue.issueUrl = `<a className="issue-link" href="${payload.issue.html_url}" target="_blank">${title}</a>`;
            issue.issueType = "issue";
            if (payload.issue.pull_request) {
                issue.issueType = "pull request";
            }
        }

        if (payload.gist) {
            gist.actionType = payload.action === 'fork' ? payload.action + 'ed' : payload.action + 'd';
            gist.gistLink = `<a className="gist-link" href="${payload.gist.html_url}" target="_blank">${'gist: ' + payload.gist.id}</a>`;
        }

        // Wiki Event
        if (data.type === 'GollumEvent') {
            var page = payload.pages[0];
            gollum.actionType = page.action;
            gollum.gollumUrl = gollum.actionType.charAt(0).toUpperCase() + gollum.actionType.slice(1) + ' ';
            gollum.gollumUrl += `<a className="gollum-link" href="${"https://github.com/" + page.html_url}" target="_blank">${page.title}</a>`;
        }

        if (data.type === 'ReleaseEvent') {
            release.tagLink = `<a className="release-tag-link" href="${payload.release.html_url}" target="_blank">${payload.release.tag_name}</a>`;
            release.zipLink = `<a className="release-zip-link" href="${payload.release.zipball_url}" target="_blank">Download Source Code (zip)</a>`;
        }

        return { icon, userGravatar, comment, branch, commits, fork, pullRequestEvent, issue, followTargetUrl, memberUrl, gist, gollum, release };
    }

    render() {
        const { actor : { login }, repo: { name }, payload, created_at } = this.props.event;
        const timeString =  millisecondsToStr(new Date() - new Date(created_at))
        const userUrl = `https://github.com/${login}`;
        const repoUrl = `https://github.com/${name}`;
        const repoComponent = `<a className="github-repo-url" href=${repoUrl} target="_blank">${name}</a>`;
        
        const { icon, userGravatar, comment, branch, commits, fork, pullRequestEvent, issue, followTargetUrl, memberUrl, gist, gollum, release } = this.renderTypes(this.props.event);

        const templates = {
            CommitCommentEvent: `commented on commit ${comment.commentUrl}<br>${userGravatar}<small>${comment.commentBody}</small>`,
            CreateEvent: `created ${payload.ref_type} ${branch.branchUrl} at ${repoComponent}`,
            DeleteEvent: `deleted ${payload.ref_type} ${payload.ref} at ${repoComponent}`,
            FollowEvent: `started following ${followTargetUrl}`,
            ForkEvent: `forked ${repoComponent} to <a href=${fork.forkUrl} target="_blank">${fork.forkName}</a>`,
            GistEvent: `${gist.actionType} ${gist.gistUrl}`,
            GollumEvent: `${gollum.actionType} the ${repoComponent} wiki<br>${userGravatar}<small>${gollum.gollumUrl}</small>`,
            IssueCommentEvent: `commented on ${issue.issueType} ${issue.issueUrl}<br>${userGravatar}<small>${comment.commentBody}</small>`,
            IssuesEvent: `${issue.action} issue ${issue.issueUrl}<br>${userGravatar}<small>${issue.title}</small>`,
            MemberEvent: `added ${memberUrl} to ${repoComponent}`,
            PublicEvent: `open sourced ${repoComponent}`,
            PullRequestEvent: `${pullRequestEvent.eventType} pull request ${pullRequestEvent.pullRequestUrl}<br>${userGravatar}<small>${pullRequestEvent.pullRequest.title}</small>${pullRequestEvent.mergeMessage}`,
            PullRequestReviewEvent: `${pullRequestEvent.eventType} pull request ${pullRequestEvent.pullRequestUrl}.<br>${userGravatar}<small>${pullRequestEvent.reviewBody}</small>`,
            PullRequestReviewCommentEvent: `commented on pull request ${pullRequestEvent.pullRequestUrl}<br>${userGravatar}<small>${comment.commentBody}</small>`,
            PushEvent:  `<span>
                            pushed to ${branch.branchUrl} at ${repoComponent}
                            <div className="github-time">${timeString}</div>
                        </span>
                        <ul className="commits">${commits.commitComponents}</ul>
                        <small>
                            <a href=${commits.commitsUrl} target="_blank">${commits.commitsMessage}</a>
                        </small>`,
            ReleaseEvent:   `released ${release.tagLink} at ${repoComponent}<br>
                            ${userGravatar}
                            <small>
                                <span class="octicon octicon-cloud-download"></span>${release.zipLink}
                            </small>`,
            WatchEvent: `starred ${repoComponent}`
        }

        return (
            <div className="github-event">
                <span className={"github-event-octicon " + icon}></span>
                <div className="github-title">
                    <a className="github-user-url" href={userUrl} target="_blank">{login}</a> {" "}
                    {parse(templates[this.props.event.type])}
                </div>
            </div>
        );
    }
}

// Takes in milliseconds and converts it to a human readable time,
// such as 'about 3 hours ago' or '23 days ago'
function millisecondsToStr(milliseconds) {
    function numberEnding(number) {
        return (number > 1) ? 's ago' : ' ago';
    }
    var temp = Math.floor(milliseconds / 1000);

    var years = Math.floor(temp / 31536000);
    if (years) return years + ' year' + numberEnding(years);

    var months = Math.floor((temp %= 31536000) / 2592000);
    if (months) return months + ' month' + numberEnding(months);

    var days = Math.floor((temp %= 2592000) / 86400);
    if (days) return days + ' day' + numberEnding(days);

    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) return 'about ' + hours + ' hour' + numberEnding(hours);

    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) return minutes + ' minute' + numberEnding(minutes);

    var seconds = temp % 60;
    if (seconds) return seconds + ' second' + numberEnding(seconds);

    return 'just now';
}

function pluralize(word, number) {
    if (number !== 1) return word + 's';
    return word;
}

const icons = {
    CommitCommentEvent: 'comment-discussion',
    CreateEvent_repository: 'repo-create',
    CreateEvent_tag: 'tag',
    CreateEvent_branch: 'git-branch-create',
    DeleteEvent: 'repo-delete',
    FollowEvent: 'person-follow',
    ForkEvent: 'repo-forked',
    GistEvent: 'gist',
    GollumEvent: 'repo',
    IssuesEvent: 'issue-opened',
    IssueCommentEvent: 'comment-discussion',
    MemberEvent: 'person',
    PublicEvent: 'globe',
    PullRequestEvent: 'git-pull-request',
    PullRequestReviewEvent_approved: 'check',
    PullRequestReviewEvent_commented: 'comment-discussion',
    PullRequestReviewEvent_changes_requested: 'alert',
    PullRequestReviewCommentEvent: 'comment-discussion',
    PushEvent: 'git-commit',
    ReleaseEvent: 'tag',
    WatchEvent: 'star'
}
