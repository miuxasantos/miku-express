import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule, ToolbarModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
