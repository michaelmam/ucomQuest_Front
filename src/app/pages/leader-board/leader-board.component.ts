import {Component, HostListener, OnInit} from '@angular/core';
import {LeaderBoardService} from "../../shared/service/leader-board.service";
import {MatTableDataSource} from "@angular/material/table";
import {animate, sequence, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';

export const rowsAnimation =
  trigger('rowsAnimation', [
    transition('void => *', [
      style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
      sequence([
        animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none'  })),
        animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]);
export const mm =
  trigger('mm', [
    // state('true', style({ 'background-color': '#abd' })),
    // state('false', style({ 'background-color': 'red' })),
    transition('false <=> true', [
      animate(500, style({ 'background-color': '#abd' })),
      transition('* => true', [
        animate(500, style({ 'background-color': 'red' }))
      ])
    ])
  ])
export const fadeOut =
  trigger('fadeOut', [
    state('void', style({ background: 'pink', borderBottomColor: 'pink', opacity: 0, transform: 'translateX(-550px)', 'box-shadow': 'none' })),
    transition('void => *', sequence([
      animate(".5s ease")
    ])),
    transition('* => void', [animate("5s ease")])
  ]);
@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css'],
  animations: [rowsAnimation, mm, fadeOut],
})
export class LeaderBoardComponent implements OnInit {
  // letters = '0123456789ABCDEF';
  displayedColumns: string[] = [
    'Թիմի անունը',
    'Գտնվելու վայրը',
    'Միավորները'
  ];
  leaderboardData: {}[] = []
  map = {};
  dataSource = new MatTableDataSource(this.leaderboardData);
  columnsToDisplay: string[] = this.displayedColumns.slice();
  constructor(private leaderboardService: LeaderBoardService,
              private router: Router) { }
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keydown', ['$event'])
  keUp(e: { keyCode: string | number; type: string; }) {
    // @ts-ignore
    this.map[e.keyCode] = e.type == 'keydown';
    // @ts-ignore
    if( this.map[17] && this.map[16] && this.map[76]) {
      console.log('Keypress ctrl + shift + l');
      this.router.navigateByUrl('/login')
    }
  }
  ngOnInit(): void {
    this.getData()
    setInterval(() => {
      this.getData()
    }, 5 * 1000)
  }
  getData() {
    this.leaderboardService.getLeaderBoardData().subscribe(data => {
      this.leaderboardData = data;
      this.dataSource.data = this.leaderboardData;
    })
  }

  setStyle(row: any, index: number) {
    let percentFill = row.percent * row.total
    percentFill = percentFill < 10 ? 10 : percentFill
    // let randomColor = '#';
    // for (let i = 0; i < 6; i++) {
    //   randomColor += this.letters[Math.floor(Math.random() * 16)];
    // }                                          // 126, 188, 10
    return {                                      // 98 - 77 * 5 + 0                       77 + 175 - 0
      'background': `linear-gradient(45deg, rgba(${(91.2 - percentFill) * 5 + index * 10}, ${percentFill + 82 - index * 3}, ${82 - percentFill + 5 * (index + 1)}, 0.8) ${percentFill}%, rgb(255, 255, 255) ${percentFill}%, rgba(255,255,255,1) 100%)`
    };
  }
}
