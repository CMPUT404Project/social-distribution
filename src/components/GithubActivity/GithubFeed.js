import React, { Component, PropTypes } from 'react'
import GithubEvent from './GithubEvent'

import "./GithubFeed.css"

export default class GithubFeed extends Component {
    propTypes: {
        fullName: PropTypes.isRequired,
        userName: PropTypes.isRequired,
        avatarUrl: PropTypes.isRequired,
        events: PropTypes.isRequired,
        isEmpty: PropTypes.isRequired
    }
    renderEvents() {
        return this.props.events.map(event => {
            return <GithubEvent key={event.id} event={event} />
        })
    }

    render() {
        return (
            <div className="github-feed">
                <div className="github-header-outer">
                    <div className="github-header">
                        <div className="github-icon">
                            <span className="github-icon-octicon octicon octicon-mark-github"></span>
                        </div>
                        {!this.props.avatarUrl ? (
                        <a className="github-profile" href={ "https://github.com/"+ this.props.userName } target="_blank">
                            <div className="github-fullname" >
                                { this.props.fullName ? this.props.fullName : this.props.userName }
                            </div>
                            <div className="github-username" style={{color: "red"}}>
                                {this.props.userName ? 
                                    "Github acitivty could not be loaded for " + this.props.userName :
                                    "Please add your github to your profile and try again"}
                            </div>
                        </a>
                        ) : (
                        <a className="github-profile" href={ "https://github.com/"+ this.props.userName } target="_blank">
                            <div className="github-fullname">
                            { this.props.fullName ? this.props.fullName : this.props.userName }
                            </div>
                            <div className="github-username">
                            { this.props.fullName ? this.props.userName : "" }
                            </div>
                        </a>
                        )}
                        <div className="github-avatar">
                            <img className="github-avatar-img" src={ this.props.avatarUrl } />
                        </div>
                    </div>
                </div>
                <div className="github-feedlist-outer">
                    <div className="github-feedlist">
                        <div className="github-feedlist-inner">
                            {this.props.isEmpty ? (<div className="empty-events">No events to show</div>) : (this.renderEvents())}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
