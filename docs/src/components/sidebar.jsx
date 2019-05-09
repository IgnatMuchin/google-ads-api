import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

import { getSubsectionTitle, stringMatch } from '../utils'

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { search: '' }
    }

    componentWillReceiveProps(nextProp, prevProp) {
        if (nextProp.currentSection !== prevProp.currentSection) {
            const current_el = document.getElementById(`sidebar-${nextProp.currentSection}`)
            const sidebar_el = document.getElementById('section-list')

            if (current_el) {
                const margin = window.innerHeight / 3 + current_el.parentElement.offsetHeight
                sidebar_el.scrollTop = current_el.offsetTop - margin
            }
        }
    }

    handleSearch = event => {
        this.setState({ search: event.target.value })
    }

    render() {
        const { sections, currentSection } = this.props

        const getSubsectionRows = subsections => {
            return Object.keys(subsections).map(index => {
                const subsection = subsections[index]

                const subsection_id = `sidebar-${subsection.id}`
                const subsection_link_id = `#${subsection.id}`

                if (subsection.id === currentSection) {
                    return (
                        <li
                            id={subsection_id}
                            key={subsection_id}
                            className="entity-child active pointer f5-5 pt1 pl3 pb1"
                        >
                            <Link to={'/' + subsection_link_id}>{getSubsectionTitle(subsection)}</Link>
                        </li>
                    )
                }

                return (
                    <li id={subsection_id} key={subsection_id} className="entity-child pointer f5-5 pt1 pl3 pb1">
                        <Link to={'/' + subsection_link_id}>{getSubsectionTitle(subsection)}</Link>
                    </li>
                )
            })
        }

        const SectionRows = Object.keys(sections).map(section => {
            const subsections = sections[section]
            const section_key = `sidebar-${section}`
            const section_id = `/#${section.toLowerCase()}`

            const subsection_ids = Object.keys(subsections).map(index => subsections[index].id)

            const searched =
                this.state.search && this.state.search.length > 0 ? stringMatch(section, this.state.search) : true

            if (!searched) {
                return null
            }

            if (!subsection_ids.includes(currentSection)) {
                return (
                    <li key={section_key} className="mv0 pb2">
                        <Link className="entity pl3 pointer" to={section_id}>
                            {section}
                        </Link>
                    </li>
                )
            }

            return (
                <li key={section_key} className=" mv0 pb2">
                    <div className="relative">
                        <div className="indicator absolute top-0 left-0 h-100 bg-opteo-link-blue"></div>
                        <Link className="entity active pointer pt1 pl3 pb1 db bg-opteo-light-gray" to={section_id}>
                            {section}
                        </Link>
                    </div>
                    <ul className="list pt2 pl3 pb2" id={section_key}>
                        {getSubsectionRows(subsections)}
                    </ul>
                </li>
            )
        })

        return (
            <div
                className="absolute top-0 h-100 flex flex-column fw4 bg-white fixed br b--opteo-light-gray"
                style={{ maxWidth: '280px' }}
            >
                <Link className="f3 tc pv3 opteo-gray hover-opteo-gray" to="/">
                    google-ads-api
                </Link>
                <div className="pl3 pr3">
                    <input className="w-100 pa1 br2 ba b--opteo-light-gray" type="text" placeholder="search" value={this.state.search} onChange={this.handleSearch} />
                </div>
                <div className="f6 pa3 bb b--opteo-light-gray opteo-middle-gray">CORE RESOURCES</div>
                <ul id="section-list" className="list f5 pv3 overflow-y-auto">
                    {SectionRows}
                </ul>
            </div>
        )
    }
}

Sidebar.propTypes = {
    sections: PropTypes.object.isRequired,
    currentSection: PropTypes.string,
}

export default Sidebar
