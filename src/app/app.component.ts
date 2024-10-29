import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Drawflow from 'drawflow'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

    title = 'angular-workflow-graph';

    editor?: Drawflow;
    mobile_last_move: any;
    mobile_item_selec: string = '';

    @ViewChild('drawflow', { static: true }) drawflow?: ElementRef;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (!this.drawflow) return;

        this.editor = new Drawflow(this.drawflow.nativeElement);
        this.editor.reroute = true;
        this.editor.start();
        // this.editor.editor_mode = 'edit';
        // this.editor.zoom_max = 1.6;
        // this.editor.zoom_min = 0.5;
        // this.editor.zoom_value = 0.1;

        this.initEditorData();
        this.handleEditorEvent();

        /* Mouse and Touch Actions */
        const elements = document.getElementsByClassName('drag-drawflow');

        console.log('elements', elements);

        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener('touchend', this.drop, false);
            elements[i].addEventListener('touchmove', this.positionMobile, false);
            elements[i].addEventListener('touchstart', this.drag, false);
        }
    }

    initEditorData() {
        const data = {
            name: 'First Node'
        };
        this.editor?.addNode('foo', 1, 1, 100, 200, 'foo', data, `
            <div>
                <div class="title-box">
                    <i class="fab fa-facebook"></i> 
                    FOO
                </div>       
            </div> `, false);
        this.editor?.addNode('bar', 1, 1, 400, 100, 'bar', data, `
            <div>
                <div class="title-box">
                    <i class="fab fa-facebook"></i> 
                    Bar A
                </div>       
            </div> `, false);
        this.editor?.addNode('bar', 1, 1, 400, 300, 'bar', data, `
            <div>
                <div class="title-box">
                    <i class="fab fa-facebook"></i> 
                    Bar B
                </div>       
            </div> `, false);

        this.editor?.addConnection(1, 2, "output_1", "input_1");
        this.editor?.addConnection(1, 3, "output_1", "input_1");
    }

    positionMobile(ev: any) {
        this.mobile_last_move = ev;
    }

    allowDrop(ev: any) {
        ev.preventDefault();
    }

    drag(ev: any) {
        console.log('drag', ev);
        if (ev.type === "touchstart") {
            this.mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
        }
    }

    drop(ev: any) {
        console.log('on drop', ev);

        ev.preventDefault();
        const data = ev.dataTransfer.getData("node");
        this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }

    addNodeToDrawFlow(name: string, pos_x: number, pos_y: number) {
        if (!this.editor) return false;

        if (this.editor?.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
        pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)));


        switch (name) {
            case 'facebook':
                var facebook = `
                <div>
                    <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
                </div>
                `;
                this.editor?.addNode('facebook', 0, 1, pos_x, pos_y, 'facebook', {}, facebook, false);
                break;
            case 'slack':
                var slackchat = `
                <div>
                    <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
                </div>
                `;
                this.editor?.addNode('slack', 1, 0, pos_x, pos_y, 'slack', {}, slackchat, false);
                break;
            case 'github':
                var githubtemplate = `
                    <div>
                    <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
                    <div class="box">
                        <p>Enter repository url</p>
                    <input type="text" df-name>
                    </div>
                    </div>
                    `;
                this.editor?.addNode('github', 0, 1, pos_x, pos_y, 'github', { "name": '' }, githubtemplate, false);
                break;
            case 'telegram':
                var telegrambot = `
                    <div>
                    <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
                    <div class="box">
                        <p>Send to telegram</p>
                        <p>select channel</p>
                        <select df-channel>
                        <option value="channel_1">Channel 1</option>
                        <option value="channel_2">Channel 2</option>
                        <option value="channel_3">Channel 3</option>
                        <option value="channel_4">Channel 4</option>
                        </select>
                    </div>
                    </div>
                    `;
                this.editor?.addNode('telegram', 1, 0, pos_x, pos_y, 'telegram', { "channel": 'channel_3' }, telegrambot, false);
                break;
            case 'aws':
                var aws = `
                    <div>
                    <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
                    <div class="box">
                        <p>Save in aws</p>
                        <input type="text" df-db-dbname placeholder="DB name"><br><br>
                        <input type="text" df-db-key placeholder="DB key">
                        <p>Output Log</p>
                    </div>
                    </div>
                    `;
                this.editor?.addNode('aws', 1, 1, pos_x, pos_y, 'aws', { "db": { "dbname": '', "key": '' } }, aws, false);
                break;
            case 'log':
                var log = `
              <div>
                <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
              </div>
              `;
                this.editor?.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log, false);
                break;
            case 'google':
                var google = `
              <div>
                <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
              </div>
              `;
                this.editor?.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google, false);
                break;
            case 'email':
                var email = `
              <div>
                <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
              </div>
              `;
                this.editor?.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email, false);
                break;

            case 'template':
                var template = `
              <div>
                <div class="title-box"><i class="fas fa-code"></i> Template</div>
                <div class="box">
                  Ger Vars
                  <textarea df-template></textarea>
                  Output template with vars
                </div>
              </div>
              `;
                this.editor?.addNode('template', 1, 1, pos_x, pos_y, 'template', { "template": 'Write your template' }, template, false);
                break;
            case 'multiple':
                var multiple = `
              <div>
                <div class="box">
                  Multiple!
                </div>
              </div>
              `;
                this.editor?.addNode('multiple', 3, 4, pos_x, pos_y, 'multiple', {}, multiple, false);
                break;
            case 'personalized':
                var personalized = `
              <div>
                Personalized
              </div>
              `;
                this.editor?.addNode('personalized', 1, 1, pos_x, pos_y, 'personalized', {}, personalized, false);
                break;
            case 'dbclick':
                var dbclick = `
                <div>
                <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
                    <div class="box dbclickbox" ondblclick="showpopup(event)">
                    Db Click here
                    <div class="modal" style="display:none">
                        <div class="modal-content">
                        <span class="close" onclick="closemodal(event)">&times;</span>
                        Change your variable {name} !
                        <input type="text" df-name>
                        </div>
    
                    </div>
                    </div>
                </div>
                `;
                this.editor?.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', { name: '' }, dbclick, false);
                break;

            default:
                break;
        }
        return true;
    }

    handleEditorEvent() {
        // Events!
        this.editor?.on('nodeCreated', function (id) {
            console.log("Node created " + id);
        })

        this.editor?.on('nodeRemoved', function (id) {
            console.log("Node removed " + id);
        })

        this.editor?.on('nodeSelected', function (id) {
            console.log("Node selected " + id);
        })

        this.editor?.on('moduleCreated', function (name) {
            console.log("Module Created " + name);
        })

        this.editor?.on('moduleChanged', function (name) {
            console.log("Module Changed " + name);
        })

        this.editor?.on('connectionCreated', function (connection) {
            console.log('Connection created');
            console.log(connection);
        })

        this.editor?.on('connectionRemoved', function (connection) {
            console.log('Connection removed');
            console.log(connection);
        })

        this.editor?.on('mouseMove', function (position) {
            console.log('Position mouse x:' + position.x + ' y:' + position.y);
        })

        this.editor?.on('nodeMoved', function (id) {
            console.log("Node moved " + id);
        })

        this.editor?.on('zoom', function (zoom) {
            console.log('Zoom level ' + zoom);
        })

        this.editor?.on('translate', function (position) {
            console.log('Translate x:' + position.x + ' y:' + position.y);
        })

        this.editor?.on('addReroute', function (id) {
            console.log("Reroute added " + id);
        })

        this.editor?.on('removeReroute', function (id) {
            console.log("Reroute removed " + id);
        })
    }
}
