import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyService } from './company.service';
import { AuthService } from '../auth/auth.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { ResponseUtilities } from 'src/utils/response.util';
import { COMMON_MESSAGE } from 'src/utils/message.enum';
import { EditCompanyDto } from './dto/editCompany.dto';

enum PATH {
  main = 'company',
  create = 'create',
  list = 'list',
  details = 'details/:id',
  edit = 'edit/:id',
  delete = 'delete/:id',
}

@UseGuards(AuthGuard)
@Controller(PATH.main)
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
  ) {}

  @Post(PATH.create)
  @UsePipes(new ValidationPipe())
  async createCompany(@Body() data: CreateCompanyDto, @Request() req) {
    const user = req?.user;

    data.createdBy = user?._id;
    const newData = await this.companyService.createCompany(data);
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      newData,
    );
  }

  @Post(PATH.list)
  async listCompany() {
    const companyList = await this.companyService.listCompany();
    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      companyList,
    );
  }

  @Post(PATH.details)
  async detailsCompany(@Param('id') id: string) {
    const companyData = await this.companyService.getCompany({
      isActive: true,
      isDeleted: false,
    });
    if (!companyData) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      companyData,
    );
  }

  @Post(PATH.edit)
  @UsePipes(new ValidationPipe())
  async editCompany(
    @Param('id') id: string,
    @Body() editCompany: EditCompanyDto,
    @Request() req,
  ) {
    const user = req?.user;
    editCompany.updatedBy = user?._id;

    const updateCompany = await this.companyService.editCompany(
      id,
      editCompany,
    );
    if (!updateCompany) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      updateCompany,
    );
  }

  @Post(PATH.delete)
  async deleteCompany(@Param('id') id: string, @Request() req) {
    const user = req?.user;
    const deleteCompany = await this.companyService.deleteCompany(id, user);
    if (!deleteCompany) {
      return ResponseUtilities.responseWrapper(
        false,
        COMMON_MESSAGE.NotFound.replace('{param}', 'Company'),
        404,
      );
    }

    return ResponseUtilities.responseWrapper(
      true,
      COMMON_MESSAGE.Success,
      200,
      deleteCompany,
    );
  }
}
