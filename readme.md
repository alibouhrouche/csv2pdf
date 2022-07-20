# csv2pdf

> A Simple PDF generator for CSV files

## Install

```
$ npm i -g csv2pdf
```

## Usage

```
$ csv2pdf --help
Usage: csv2pdf [options] [command]

A Simple pdf generator for CSV files

Options:
  -V, --version                    output the version number
  -h, --help                       display help for command

Commands:
  generate [options] <input-file>  Generate a PDF file from a specified CSV file.
  help [command]                   display help for command
```

# Example
```
$ csv2pdf generate input.csv -t template.tpl -o out.pdf
100 page generated.
```