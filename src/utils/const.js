import { getEnv } from './env'
export const APPOINT_COURSEID = {
    dev:586,
    test:586,
    pre:76,
    prod:76
}
export const awatorList = [
    {src:'https://img.kaikeba.com/a/83855121500202uwji.png'},
    {src:'https://img.kaikeba.com/a/44547121500202null.png'},
    {src:'https://img.kaikeba.com/a/95547121500202zmzk.png'},
    {src:'https://img.kaikeba.com/a/63647121500202sofx.png'},
    {src:'https://img.kaikeba.com/a/05647121500202kxpf.png'},
    {src:'https://img.kaikeba.com/a/10747121500202nrib.png'},
    {src:'https://img.kaikeba.com/a/21747121500202pllu.png'},
    {src:'https://img.kaikeba.com/a/42747121500202hasm.png'},
    {src:'https://img.kaikeba.com/a/83747121500202fzgn.png'},
    {src:'https://img.kaikeba.com/a/84747121500202jtqm.png'},
    {src:'https://img.kaikeba.com/a/75747121500202bztq.png'}
]

export const wwwUrlpix = {
    dev:'https://testwww.kaikeba.com',
    test:'https://testwww.kaikeba.com',
    pre:'https://prewww.kaikeba.com',
    prod:'https://www.kaikeba.com'
}

export const LEARNEDU_TOKENFIX = {
    dev:'access-edu_dev',
    test:'access-edu_test',
    pre:'access-edu_pre',
    prod:'access-edu_online'
}

export const KKBPassportAppIdFix = {
    dev:'hky6579974705414',
    test:'hky6579974705414',
    pre:'wxd7213d81e70ff3c0',
    prod:'hky5530285530845',
}

export const defaultAppidFix = {
    dev:'wxf47dff26f5a918f7',
    test:'wxf47dff26f5a918f7',
    pre:'wxf47dff26f5a918f7',
    prod:'wx5046bc7413796142',
}

export const wwwUrl = wwwUrlpix[getEnv()]
export const LEARNEDU_TOKEN = LEARNEDU_TOKENFIX[getEnv()]
export const KKBPassportAppId = KKBPassportAppIdFix[getEnv()]
export const defaultAppid = defaultAppidFix[getEnv()]