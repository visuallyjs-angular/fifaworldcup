import {FIFACountryCode} from "./fifa-converter.js";

const urlBase = "https://raw.githubusercontent.com/openfootball/worldcup.json/refs/heads/master"
const MATCHES_DATA = "worldcup.json"
const GROUPS_DATA = "worldcup.groups.json"
const TEAMS_DATA = "worldcup.teams.json"
const STADIUMS_DATA = "worldcup.stadiums.json"

const cache = {}

function _getCachedDataset(year, dataset, extractor) {
    cache[year] = cache[year] || {}
    const data = cache[year][dataset]
    if (data != null) {
        return Promise.resolve(data)
    } else {
        return fetch(`${urlBase}/${year}/${dataset}`).then(r => r.json()).then(j => {
            const d = extractor ? extractor(j) : j
            cache[year][dataset] = d
            return d
        })
    }
}

function _getCachedItem(year, itemCategory, itemId, retriever) {
    cache[year] = cache[year] || {}
    cache[year][itemCategory] = cache[year][itemCategory] || {}
    const itemData = cache[year][itemCategory][itemId]
    if (itemData != null) {
        return Promise.resolve(itemData)
    } else {
        return retriever().then(d => {
            cache[year][itemCategory][itemId] = d
            return d
        })
    }
}

/**
 * gets group definitions for the given year
 * @param year
 * @return {Promise<*>}
 */
export async function getGroups(year) {
    return _getCachedDataset(year, GROUPS_DATA, (d) => d.groups)
}

/**
 * gets a specific group definition for the given year
 * @param year
 * @param name
 * @return {Promise<T>}
 */
export async function getGroup(year, name) {
    return _getCachedDataset(year, GROUPS_DATA, (d) => d.groups).then(groups => groups.filter(g => g.name === name)[0])
}

/**
 * gets teams in the given group in the given year
 * @param year
 * @param groupName
 * @return async array of teams
 */
export async function getGroupTeams(year, groupName) {
    const group = await getGroup(year, groupName)
    return Promise.all(group.teams.map(t => getTeam(year, t)))
}

export async function getTeams(year) {
    return _getCachedDataset(year, TEAMS_DATA)
}

export async function getTeam(year, name) {
    return _getCachedItem(year, "teams", name, () => {
        return getTeams(year).then(teams => teams.find(t => t.name === name)).then(team => {
            return {
                ...team,
                id:team.name,
                isoCode:FIFACountryCode(team.fifa_code).ISO2
            }
        })
    })
}

export async function getMatches(year) {
    return _getCachedDataset(year, MATCHES_DATA, (d) => d.matches)
}

export async function getGroupMatches(year, groupName) {
    return _getCachedItem(year, "groupMatches", groupName, () => {
        return getMatches(year).then(matches => matches.filter(m => m.group === groupName ))
    })
}

export async function getGroupStats(year, groupName) {
    const group = await getGroup(year, groupName)
    const teams = await getGroupTeams(year, groupName)
    const matches = await getGroupMatches(year, groupName)

    return {
        group, teams, matches
    }
}
