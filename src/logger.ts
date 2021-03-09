import * as chalk from 'chalk'
import * as moment from 'moment'
import * as PrettyError from 'pretty-error'

export class Logger {
  private readonly prettyError: PrettyError

  constructor(private readonly context: string) {
    this.prettyError = new PrettyError()
    this.prettyError.skipNodeFiles()
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core')
  }

  error(message: string, trace?: string): void {
    this.formatedLog('error', message, trace)
  }

  log(message: string): void {
    this.info(message)
  }

  info(message: string): void {
    this.formatedLog('info', message)
  }

  warn(message: string): void {
    this.formatedLog('warn', message)
  }

  debug(message: string): void {
    this.formatedLog('debug', message)
  }

  verbose(message: string): void {
    this.formatedLog('verbose', message)
  }

  private formatedLog(level: string, message: string, error?: string): void {
    let result = ''
    const time = moment().format('DD/MM/YY HH:mm:ss')

    switch (level) {
      case 'info':
        result = `[${chalk.blue('INFO')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`
        break
      case 'debug':
        result = `[${chalk.magenta('DEBUG')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`
        break
      case 'verbose':
        result = `[${chalk.cyan('VERBOSE')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`
        break
      case 'error':
        result = `[${chalk.red('ERR')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`
        if (error && process.env.NODE_ENV === 'dev') {
          this.prettyError.render(error, true)
        }
        break
      case 'warn':
        result = `[${chalk.yellow('WARN')}] ${chalk.dim.yellow.bold.underline(
          time,
        )} [${chalk.green(this.context)}] ${message}`
        break
      default:
        break
    }
    console.log(result)
  }
}
