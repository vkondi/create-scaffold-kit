import chalk from 'chalk';
import ora, { Ora } from 'ora';

class Logger {
  private spinner: Ora | null = null;

  public info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  public success(message: string): void {
    console.log(chalk.green('✔'), message);
  }

  public warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  public error(message: string): void {
    console.log(chalk.red('✖'), message);
  }

  public step(message: string): void {
    console.log(chalk.cyan('→'), message);
  }

  public startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  public succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  public failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  public stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  public newLine(): void {
    console.log();
  }

  public bold(text: string): string {
    return chalk.bold(text);
  }

  public dim(text: string): string {
    return chalk.dim(text);
  }
}

export const logger = new Logger();
