import {Component, OnInit} from '@angular/core';
import {ModalTypesEnum} from "@app/enums/modal-types.enum";
import {NgbActiveModal, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {Roleauthority} from "@app/entities/roleauthority";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {RoleauthorityService} from "@app/services/roleauthority.service";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {Role} from "@app/entities/role";
import {AuthorityService} from "@app/services/authority.service";
import {Authority} from "@app/entities/authority";
import {RoleService} from "@app/services/role.service";


@Component({
  selector: 'app-roleauthority-form',
  templateUrl: './roleauthority-form.component.html',
  styleUrls: ['./roleauthority-form.component.css']
})
export class RoleauthorityFormComponent implements OnInit {

  ModalTypesEnum = ModalTypesEnum;
  faCalendar = faCalendar;

  modalType?: ModalTypesEnum;
  inputRoleauthority?: Roleauthority;
  isOpen2?: boolean;
  roleauthorityForm = this.fb.group({
    id: [],
    role: [],
    authority: [],
    start_date: [],
    end_date: []
  });
  authorities?: Authority[] | null | undefined = [];
  roles?: Role[] | null | undefined = [];


  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private roleauthorityService: RoleauthorityService,
    private authorityService: AuthorityService,
    private roleService: RoleService
  ) {
  }

  ngOnInit(): void {
    if (this.inputRoleauthority !== undefined) {
      this.updateForm(this.inputRoleauthority);
    }
    this.authorityService.getAuthorities().subscribe(data => {
      this.authorities = data.body;
    })

    this.roleService.getRoles().subscribe(data => {
      this.roles = data.body;
    })
  }

  close(): void {
    this.activeModal.close(false);
  }

  save(): void {
    const roleauthority = this.createFromForm();
    if (roleauthority.id !== undefined) {
      this.subscribeToSaveResponse(this.roleauthorityService.updateRoleAuthority(roleauthority));
    } else {
      this.subscribeToSaveResponse(this.roleauthorityService.addRoleAuthority(roleauthority));
    }
  }

  private createFromForm(): Roleauthority {
    const start_date = this.roleauthorityForm.get('start_date')!.value;
    const end_date = this.roleauthorityForm.get('end_date')!.value;
    const roleauthority = new Roleauthority();
    roleauthority.id = this.inputRoleauthority?.id;
    roleauthority.role = this.roleauthorityForm.get('role')!.value;
    roleauthority.authority = this.roleauthorityForm.get('authority')!.value;
    roleauthority.start_date = new Date(start_date.year, start_date.month - 1, start_date.day);
    roleauthority.end_date = new Date(end_date.year, end_date.month - 1, end_date.day);

    return roleauthority;
  }

  private updateForm(roleauthority: Roleauthority): void {
    const start_date = new Date(roleauthority?.start_date!);
    const end_date = new Date(roleauthority?.end_date!);
    this.roleauthorityForm.setValue({
      id: roleauthority?.id,
      role: roleauthority?.role,
      authority: roleauthority?.authority,
      start_date: new NgbDate(start_date?.getFullYear(), start_date?.getMonth() + 1, start_date?.getDate()),
      end_date: new NgbDate(end_date?.getFullYear(), end_date?.getMonth() + 1, end_date?.getDate())
    });
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Roleauthority>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  private onSaveSuccess(): void {
    this.activeModal.close(true);
    if (this.modalType === ModalTypesEnum.CREATE) {
      this.toastr.success('Role-authority created!', 'Success!');
    } else {
      this.toastr.success('Role-authority modified!', 'Success!');
    }
  }

  private onSaveError(): void {
    if (this.modalType === ModalTypesEnum.CREATE) {
      this.toastr.error('Error creating role-authority!', 'Error!');
    } else {
      this.toastr.error('Error modifying role-authority!', 'Error!');
    }
  }
}
