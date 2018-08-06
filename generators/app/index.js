'use strict'

const Generator = require('yeoman-generator')
const path = require('path')

module.exports = class extends Generator {
  async prompting() {
    const defaultUsername = await this.user.github.username()

    const gitName = await this.user.git.name()
    const gitEmail = await this.user.git.email()
    const defaultAuthor = `${gitName} <${gitEmail}>`

    const defaultPackageName = path.basename(this.destinationRoot())

    const prompts = [
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name:',
        default: defaultPackageName
      },
      {
        type: 'input',
        name: 'packageDescription',
        message: 'Package description:'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: defaultAuthor
      },
      {
        type: 'input',
        name: 'username',
        message: 'Username:',
        default: defaultUsername
      },
      {
        type: 'input',
        name: 'umdGlobalName',
        message: 'UMD global variable name:'
      }
    ]

    this.props = await this.prompt(prompts)
  }

  writing() {
    this.props.repoURL = `github:${this.props.username}/${
      this.props.packageName
    }`

    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      this.props,
      {},
      { globOptions: { dot: true } }
    )
  }

  install() {
    this.installDependencies({ bower: false })
  }

  end() {
    this.spawnCommandSync('git', ['init', '--quiet'], {
      cwd: this.destinationPath()
    })

    this.spawnCommandSync(
      'git',
      [
        'remote',
        'add',
        'origin',
        `git@github.com:${this.props.username}/${this.props.packageName}.git`
      ],
      {
        cwd: this.destinationPath()
      }
    )
  }
}