const cvs = document.getElementById('tetris')
const ctx = cvs.getContext('2d')
var score = 0;
const reset=document.getElementById("Reset")
reset.addEventListener("click",()=>{
    window.location.reload()
})
const shapes = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0], 
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ]
]

const colors=[
    "white",
    "red",
    "green",
    "blue",
    "purple",
    "pink",
    "cyan",
    "grey"
]

const rows = 20;
const cols = 10;
const vacant = colors[0]
const board = [];

for(r=0;r<rows;r++){
    board[r]=[]
    for(c=0;c<cols;c++){
        board[r][c]=vacant;
    }
}

DrawBoard()
let obj = genRandomPiece()
drawPiece()
setInterval(GameState,500)


function genRandomPiece(){
    let n = Math.floor(Math.random()*7)
    let piece = shapes[n]
    let color = colors[n+1]
    let x = 4;
    let y=0;
    return {piece,x,y,color}
}

document.addEventListener("keydown",function(e){
    let key = e.code;
    if(key=='ArrowDown'){
        moveDown()
    }
    else if(key=='ArrowLeft'){
        moveLeft()
    }
    else if(key=='ArrowRight'){
        moveRight()
    }
    else if(key =='ArrowUp'){
        pieceRotate()
    }
})

function GameState(){
    checkScore()
    if(!obj){
        obj = genRandomPiece()
       drawPiece()
      }
      moveDown()
}

function drawSq(x,y,color){
    ctx.fillStyle = color; //color the inside of the shape 
    const sq = 30
    ctx.fillRect(x*sq,y*sq,sq,sq)
    ctx.strokeStyle = "black" //gives border
    ctx.strokeRect(x*sq,y*sq,sq,sq) //inbuilt function to give border to the shape
}

function DrawBoard(){
    for(r=0;r<rows;r++){
        for(c=0;c<cols;c++){
            drawSq(c,r,board[r][c])
        }
    }
}

function drawPiece(){
    let piece = obj.piece
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                drawSq(obj.x+j,obj.y+i,obj.color)   //we add x and y with j and i and not i and j as i is the rows and will de added in y axis
            }
        }
    }
}

function moveDown(){
    if(!collison(obj.x,obj.y+1))
        obj.y+=1
    else{
        for(let i=0;i<obj.piece.length;i++){
            for(let j=0;j<obj.piece[i].length;j++){
                if(obj.piece[i][j]==1){
                    let a = obj.x+j;
                    let b = obj.y+i;
                    board[b][a]=obj.color
                }
            }
        }
        if(obj.y==0){
            alert("GameOver Press Ok To Play Again")
            for(r=0;r<rows;r++){
                board[r]=[]
                for(c=0;c<cols;c++){
                    board[r][c]=vacant;
                }
            }
            document.getElementById("score").innerHTML=0
        }
        else{
        obj=null
        GameState() 
        }   
    }
    renderGame()
}

function moveLeft(){
    if(!collison(obj.x-1,obj.y))
    obj.x-=1
    renderGame()
}

function moveRight(){
    if(!collison(obj.x+1,obj.y))
    obj.x+=1
    renderGame()
    
}

function pieceRotate(){
    let Newpiece = []
    for(let i=0;i<obj.piece.length;i++){
        Newpiece.push([])
        for(let j=0;j<obj.piece[i].length;j++){
            Newpiece[i][j]='0'
        }
    }

    for(let i=0;i<obj.piece.length;i++){
        for(let j=0;j<obj.piece[i].length;j++){
            Newpiece[i][j]=obj.piece[j][i]
        }
    }
    for(let i=0;i<Newpiece.length;i++){
        Newpiece=Newpiece.reverse()
    }
    if(!collison(obj.x,obj.y,Newpiece))
    obj.piece=Newpiece
    renderGame()
}

function checkScore(){
    for(let i=0;i<board.length;i++){
        let allfill = true
        for(let j=0;j<board[i].length;j++){
            if(board[i][j]==vacant){
                allfill=false
            }
        }
        if(allfill){
            board.splice(i,1)
            board.unshift([vacant,vacant,vacant,vacant,vacant,vacant,vacant,vacant,vacant,vacant])
            document.getElementById("score").innerHTML=++score
        }
        
    }

}


function renderGame(){
    checkScore()
    DrawBoard()
    drawPiece()
}


function collison(x,y,Newpiece){
    let piece = Newpiece || obj.piece
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                let a = x+j;
                let b = y+i;
                if(a>=0 && a<cols && b>=0 && b<rows){
                    if(board[b][a]!="white"){
                        return true
                    }
                }
                else{
                    return true
                }
            }
        }
    }
    return false
}

