import {Component, OnInit} from '@angular/core';
import {User} from "@app/entities/user";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "@app/services/user.service";


@Component({
  selector: 'app-users-romania',
  templateUrl: './users-romania.component.html',
  styleUrls: ['./users-romania.component.css']
})
export class UsersRomaniaComponent implements OnInit {

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  users?: User[] | null;
  markers: marker[] = [];

  loadData(): void {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data.body;
      this.loadMarkers();
    })
  }

  loadMarkers(): void {
    let i: number;
    if (this.users)
      for (i = 0; i < this.users.length; i++) {
        if (this.users[i].address?.includes("Romania"))
          this.markers.push({
            lat: this.users[i].latitude,
            lng: this.users[i].longitude,
            label: this.users[i].name?.charAt(0),
            info: this.users[i].name
          });
      }
  }

  constructor(private activeModal: NgbActiveModal,
              private userService: UserService) {
  }

  ngOnInit(): void {
      this.loadData();
  }

  close(): void {
    this.activeModal.close(false);
  }
}

interface marker {
  lat?: number;
  lng?: number;
  label?: string;
  info?: string;
}
