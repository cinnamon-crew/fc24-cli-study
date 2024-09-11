//@ts-check

//Github의 레포지토리 관리 CLI를 만들어본다.
//이슈. 풀 리퀘스트 등의 라벨 관리

/**
  node src/main.js list-bugs
 */

const fs = require('fs')

const { program } = require('commander')
program.version('0.0.1')

require('dotenv').config()
const { GITHUB_ACCESS_TOKEN } = process.env

// const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })

program
  .command('me')
  .description('Check my profile')
  .action(async () => {
    console.log('Fetching your GitHub profile...')

    // 동적 import 사용
    const { Octokit } = await import('octokit')

    const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })

    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated()
    console.log('Hello, %s', login)
  })

program
  .command('list-bugs')
  .description('List issues with bug label')
  .action(async () => {
    // 동적 import 사용
    const { Octokit } = await import('octokit')

    const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })
    const result = await octokit.rest.issues.listForRepo({
      owner: 'cinnamon-crew',
      repo: 'fc24-cli-study',
      labels: 'bug',
    })

    // //@ts-ignore
    // result.data.forEach((issue) => {
    //   console.log(issue.number, issue.labels)
    // })

    //@ts-ignore
    const issueWithBugLabel = result.data.filter(
      //@ts-ignore
      (issue) =>
        //@ts-ignore
        issue.labels.find((label) => label.name === 'bug') !== undefined,
    )

    //@ts-ignore
    const output = issueWithBugLabel.map((issue) => ({
      title: issue.title,
      number: issue.number,
    }))

    console.log(output)
    // console.log('result=', result)
  })
// 풀 리퀘스트를 모두 검사해서, 만약 너무 diff 가 큰 (100줄) 풀 리퀘스트가 있으면 'too-big' 이라는 레이블을 붙인다.
program
  .command('check-prs')
  .description('Check pull request status')
  .action(async () => {
    console.log('Check PRs!')
  })

program.parseAsync()
