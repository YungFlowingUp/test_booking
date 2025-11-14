import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource
  ) {}
  @Get('health')
  async getHealth(): Promise<Object> {
    let dataBase: string;

    try {
      await this.dataSource.query('Select 1');
      dataBase = 'подключена';
    } catch (error) {
      dataBase = 'не подключена';
    }
    return {
      status: 'База данных ' + dataBase,
      timestamp: new Date().toLocaleString()
    }
  }
}
