import { Component, OnInit} from '@angular/core';
import {faEye, faFilter, faPlus, faTrash, faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {Role} from "../../entities/role";
import {RoleService} from "../../services/role.service";
import {ModalService} from "../../services/modal.service";
import {ModalTypesEnum} from "../../enums/modal-types.enum";
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  ModalTypesEnum = ModalTypesEnum;
  faPlus = faPlus;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faFilter = faFilter;
  faEdit = faEdit;
  faEye = faEye;
  faTrash = faTrash;
  predicate: string = 'id';
  ascending: boolean = true;
  name: string = "";
  id:string ="";
  code: string="";

  roles?: Role[] | null;

  constructor(
    private roleService: RoleService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if(this.name =="" &&
      this.code =="" &&
      this.id ==""
    ) {
      this.roleService.getRoles( {
        page: this.page - 1,
        size: this.pageSize,
        sort: this.sort2()
      }).subscribe((data : HttpResponse<Role[]>) => {
        this.roles = data.body;
        this.collectionSize = Number(data.headers.get('X-Total-Count'));
      })
    } else {
      this.filter();
    }
  }

  openRoleModal(modalTypeEnum: ModalTypesEnum, inputRole?: Role) {
    this.modalService.openRoleModal(modalTypeEnum, inputRole).then((result) => {
      if(result) {
        this.loadData();
      }
    });
  }

  openDeleteModalRole(role: Role) {
    this.modalService.openDeleteModalRole(role).then((result) => {
      if(result) {
        this.loadData();
      }
    });
  }

  sort2(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  sort(col : string, ascending: boolean) {
        this.predicate = col;
        this.ascending = ascending;
        this.loadData();
  }

  filter() {
    this.roleService.filterRoles(this.id, this.name, this.code,{
      page: this.page - 1,
      size: this.pageSize,
      sort: this.sort2()
    }).subscribe(data => {
      this.roles = data.body;
      this.collectionSize = Number(data.headers.get('X-Total-Count'));
    })

  }

}






